# Lokalni FTP upload (opciono). Ne čuvaj lozinku u fajlu — koristi env:
#   $env:FTP_HOST = "ftp://176.9.84.214"
#   $env:FTP_USER = "izorvorg"
#   $env:FTP_PASS = "..."
#   $env:FTP_REMOTE = "/public_html"
param(
  [string]$LocalDir = (Join-Path $PSScriptRoot "dist")
)

$ftpHost = if ($env:FTP_HOST) { $env:FTP_HOST } else { throw "Set env FTP_HOST (e.g. ftp://176.9.84.214)" }
$ftpUser = if ($env:FTP_USER) { $env:FTP_USER } else { throw "Set env FTP_USER" }
$ftpPass = if ($env:FTP_PASS) { $env:FTP_PASS } else { throw "Set env FTP_PASS" }
$remotePath = if ($env:FTP_REMOTE) { $env:FTP_REMOTE } else { "/public_html" }

function Upload-File($localFile, $remoteFile) {
    $escaped = $remoteFile -replace ' ', '%20'
    $url = "$ftpHost$escaped"
    $attempt = 0
    $maxRetries = 3
    while ($attempt -lt $maxRetries) {
        $attempt++
        $result = & curl.exe -s -S -u "${ftpUser}:${ftpPass}" -T "$localFile" "$url" --ftp-create-dirs 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  OK: $remoteFile"
            return
        }
        Write-Host "  RETRY ($attempt): $remoteFile - $result"
        Start-Sleep -Seconds 2
    }
    Write-Host "  FAIL: $remoteFile"
}

$files = Get-ChildItem -Path $LocalDir -Recurse -File
$total = $files.Count
$i = 0

Write-Host "=== Uploading $total files to $ftpHost$remotePath ==="
Write-Host ""

foreach ($file in $files) {
    $i++
    $relativePath = $file.FullName.Substring($LocalDir.Length).Replace('\', '/')
    $remoteFile = "$remotePath$relativePath"
    Write-Host "[$i/$total] $relativePath"
    Upload-File $file.FullName $remoteFile
}

Write-Host ""
Write-Host "=== Upload complete! ==="
