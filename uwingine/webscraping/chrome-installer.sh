# #!/bin/bash
# set -e

# latest_stable_json="https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json"
# # Retrieve the JSON data using curl
# json_data=$(curl -s "$latest_stable_json")

# latest_chrome_linux_download_url="$(echo "$json_data" | jq -r ".channels.Stable.downloads.chrome[0].url")"
# latest_chrome_driver_linux_download_url="$(echo "$json_data" | jq -r ".channels.Stable.downloads.chromedriver[0].url")"

# echo "Downloading Chrome from $latest_chrome_linux_download_url"
# echo "Downloading Chrome Driver from $latest_chrome_driver_linux_download_url"

# download_path_chrome_linux="/opt/chrome-headless-shell-linux.zip"
# dowload_path_chrome_driver_linux="/opt/chrome-driver-linux.zip"

# mkdir -p "/opt/chrome"
# curl -Lo $download_path_chrome_linux $latest_chrome_linux_download_url
# unzip -q $download_path_chrome_linux -d "/opt/chrome"
# rm -rf $download_path_chrome_linux

# mkdir -p "/opt/chrome-driver"
# curl -Lo $dowload_path_chrome_driver_linux $latest_chrome_driver_linux_download_url
# unzip -q $dowload_path_chrome_driver_linux -d "/opt/chrome-driver"
# rm -rf $dowload_path_chrome_driver_linux

#!/bin/bash
set -e

latest_stable_json="https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json"
# Retrieve the JSON data using curl
json_data=$(curl -s "$latest_stable_json")
latest_chrome_linux_download_url="$(echo "$json_data" | jq -r ".channels.Stable.downloads.chrome[0].url")"
latest_chrome_driver_linux_download_url="$(echo "$json_data" | jq -r ".channels.Stable.downloads.chromedriver[0].url")"
download_path_chrome_linux="/opt/chrome-headless-shell-linux.zip"
download_path_chrome_driver_linux="/opt/chrome-driver-linux.zip"
mkdir -p "/opt/chrome"
curl -Lo $download_path_chrome_linux $latest_chrome_linux_download_url
unzip -q $download_path_chrome_linux -d "/opt/chrome"
rm -rf $download_path_chrome_linux
mkdir -p "/opt/chrome-driver"
curl -Lo $download_path_chrome_driver_linux $latest_chrome_driver_linux_download_url
unzip -q $download_path_chrome_driver_linux -d "/opt/chrome-driver"
rm -rf $download_path_chrome_driver_linux


# su - postgres
# \c langchain;
# DELETE FROM langchain_pg_collection;
# DELETE FROM langchain_pg_embedding;

# su - postgres -c "psql -d langchain -c 'DELETE FROM langchain_pg_collection;' -c 'DELETE FROM langchain_pg_embedding;'"
