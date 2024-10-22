import os
import time
import requests
import re
import threading
import concurrent.futures
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

lock = threading.Lock()
base_download_dir = "E:/Projects/Scraping"
pdfs = []

def setup_directory(base_dir, *subfolders):
    """Creates nested subdirectories if they don't exist and returns the path."""
    folder_path = os.path.join(base_dir, *subfolders)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    return folder_path

def download_pdf(url, folder):
    """Downloads a PDF from a URL and saves it to a specified folder if it doesn't already exist."""
    filename = url.split('/')[-1]
    file_path = os.path.join(folder, filename)

    # Check if the file already exists
    if os.path.exists(file_path):
        print(f"{filename} already exists in {folder}, skipping download.")
        return

    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Downloaded {filename} to {folder}")
    else:
        print(f"Failed to download {url}. Status code: {response.status_code}")

def download_dynamic_pdf(url, folder, filename):
    """Downloads a dynamically generated PDF from a URL and saves it with a specified filename."""
    file_path = os.path.join(folder, filename)

    # Check if the file already exists
    if os.path.exists(file_path):
        print(f"{filename} already exists in {folder}, skipping download.")
        return file_path

    # Send a GET request to the provided URL
    response = requests.get(url, stream=True)
    
    if response.status_code == 200:
        # Write the content to a file
        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Downloaded {filename} to {folder}")
        return file_path
    else:
        print(f"Failed to download from {url}. Status code: {response.status_code}")
        return None

def fetch_summary(link_href, link_text):
    global pdfs
    """Open a headless browser window to fetch summary text from the detail page asynchronously."""
    try:
        # Set Chrome options for headless browsing
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Ensure the browser is headless
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        driver = webdriver.Chrome(options=chrome_options)
        wait = WebDriverWait(driver, 20)

        # Visit the link and extract summary section
        driver.get(link_href)
        detailSection = wait.until(EC.presence_of_element_located((By.ID, "divDetailSummarySection")))
        detailText = detailSection.text

        with lock:
            subdiv = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "inmg-detail-table")))
            subsubdivs = subdiv.find_elements(By.XPATH, "./div")  # Find all divs inside subdiv
            
            d = {}
            # Iterate through subsubdivs
            for index, subsubdiv in enumerate(subsubdivs):
                # Check if the subsubdiv is empty
                if not subsubdiv.text.strip():  # Skip empty subsubdivs
                    continue
                
                # Check if it's last or second last in the list
                if index == len(subsubdivs) - 1 or index == len(subsubdivs) - 2:
                    continue  # Skip last and second last subsubdivs
                elif index == len(subsubdivs) - 3:
                    pdfLinks = subsubdiv.find_elements(By.CLASS_NAME, "File")
                    link = pdfLinks[0].get_attribute("href")
                    d["Live Link"] = link
                    folder = setup_directory(base_download_dir, "Senate Policies")
                    
                    rID_match = re.search(r'rID=([^&]+)', link)
                    if rID_match:
                        filename = f"Policy_{rID_match.group(1)}.pdf"
                        local_path = download_dynamic_pdf(link, folder, filename)
                        if local_path:
                            d["Local Path"] = local_path
                else:
                    key = subsubdiv.find_element(By.CLASS_NAME, "control-display-label")                
                    value = subsubdiv.find_element(By.CLASS_NAME, "field-item-content-span")
                    d[key.text] = value.text
                    # Print the data from the valid subsubdiv
                    print(f"Key: {key.text}, value: {value.text}")        
            pdfs += [d]
            # print(f"Detail for {link_text}:\n{detailText}\n")

    except Exception as e:
        print(f"Error accessing details for {link_text}: {e}")

    finally:
        driver.quit()

def main():

    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Ensure the browser is headless
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=chrome_options)
    try:
        driver.get('https://www.uwindsor.ca/registrar/')
        wait = WebDriverWait(driver, 20)
        academic_calendars_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Academic Calendars")))
        academic_calendars_link.click()
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href$='.pdf']")))

        # Diagnostic to see how many links are found on the page
        all_pdfs = driver.find_elements(By.CSS_SELECTOR, "a[href$='.pdf']")
        print(f"Total PDF links found: {len(all_pdfs)}")

        # Specific handling for current and prior year PDFs
        for pdf_link in all_pdfs:
            url = pdf_link.get_attribute('href')
            filename = url.split('/')[-1]
            print(f"Processing {url}")

            # Current year PDFs
            if '2025' in url:
                if "undergraduate" in url.lower():
                    folder = setup_directory(base_download_dir, "Undergraduate Calendar (Winter 2025)")
                elif "graduate" in url.lower():
                    folder = setup_directory(base_download_dir, "Graduate Calendar (Winter 2025)")
                download_pdf(url, folder)
            # Prior years PDFs
            else:
                year_match = re.search(r'\d{4}', filename)
                if year_match:
                    year = year_match.group(0)
                    if "undergraduate" in url.lower():
                        folder = setup_directory(base_download_dir, "Prior Undergraduate Calendars", year)
                    elif "graduate" in url.lower():
                        folder = setup_directory(base_download_dir, "Prior Graduate Calendars", year)
                    download_pdf(url, folder)

        uniPolicies = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "University Bylaws & Policies")))
        uniPolicies.click()
        senatePolicies = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Senate Policies")))
        senatePolicies.click()

        # Find the checkbox labeled "Active" under the "Status" filter
        activeCheckbox = wait.until(EC.element_to_be_clickable((By.ID, "lblSearch_231_Active")))
        activeCheckbox.click()

        # Wait for the filter to apply and the results to load
        time.sleep(10)  # Adjust the sleep time if necessary depending on page load speed

        # Find the container holding the filtered results (id="ctPolicies-result-item-container")
        resultsContainer = wait.until(EC.presence_of_element_located((By.ID, "ctPolicies-result-item-container")))

        # Find all elements with class="citation-item-container" inside the results container
        policyItems = resultsContainer.find_elements(By.CLASS_NAME, "citation-item-container")

        # Loop through each policy item and extract the link and text from the third <td> element
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = []
            for item in policyItems:
                try:
                    # Locate the 3rd <td> within the <tr> of the <table>
                    linkElement = item.find_element(By.XPATH, ".//table/tbody/tr/td[3]/a")
                    linkText = linkElement.text
                    linkHref = linkElement.get_attribute("href")

                    # Submit a new task to fetch summary using a headless browser
                    futures.append(executor.submit(fetch_summary, linkHref, linkText))

                except Exception as e:
                    print(f"Error processing policy: {e}")

            # Wait for all futures to complete
            concurrent.futures.wait(futures)
            print("All threads have completed their execution!")
            print(pdfs)

        # Bylaws
        driver.get("https://www.uwindsor.ca/policies")

        byLaws = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Senate Bylaws")))
        byLaws.click()

        # Find the checkbox labeled "Active" under the "Status" filter
        activeCheckbox = wait.until(EC.element_to_be_clickable((By.ID, "lblSearch_231_Active")))
        activeCheckbox.click()

        # Wait for the filter to apply and the results to load
        time.sleep(10)  # Adjust the sleep time if necessary depending on page load speed

        # Find the container holding the filtered results (id="ctPolicies-result-item-container")
        resultsContainer = wait.until(EC.presence_of_element_located((By.ID, "ctPolicies-result-item-container")))

        # Find all elements with class="citation-item-container" inside the results container
        policyItems = resultsContainer.find_elements(By.CLASS_NAME, "citation-item-container")

        # Loop through each policy item and extract the link and text from the third <td> element
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = []
            for item in policyItems:
                try:
                    # Locate the 3rd <td> within the <tr> of the <table>
                    linkElement = item.find_element(By.XPATH, ".//table/tbody/tr/td[3]/a")
                    linkText = linkElement.text
                    linkHref = linkElement.get_attribute("href")

                    # Submit a new task to fetch summary using a headless browser
                    futures.append(executor.submit(fetch_summary, linkHref, linkText))

                except Exception as e:
                    print(f"Error processing policy: {e}")

            # Wait for all futures to complete
            concurrent.futures.wait(futures)
            print("All threads have completed their execution!")
            print(pdfs)

    finally:
        driver.quit()

if __name__ == "__main__":
    main()