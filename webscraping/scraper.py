import os
import time
import requests
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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

def generate_download_link(detail_url):
    """
    Generates the download link from the detailed policy link.
    Example:
    Detail URL: 
    'https://lawlibrary.uwindsor.ca/Presto/content/Detail.aspx?ctID=OTdhY2QzODgtNjhlYi00ZWY0LTg2OTUtNmU5NjEzY2JkMWYx&rID=MTE=&qrs=RmFsc2U=&q=...'
    
    Expected download link: 
    'https://lawlibrary.uwindsor.ca/Presto//GetDoc.axd?ctID=OTdhY2QzODgtNjhlYi00ZWY0LTg2OTUtNmU5NjEzY2JkMWYx&rID=MTE=&pID=MjMy&attchmnt=False&uSesDM=False&rIdx=MTE=&rCFU='
    """
    base_url = 'https://lawlibrary.uwindsor.ca/Presto//GetDoc.axd'
    
    # Extract the relevant parameters (rID, ctID, etc.) from the detail URL
    rID_match = re.search(r'rID=([^&]+)', detail_url)
    ctID_match = re.search(r'ctID=([^&]+)', detail_url)
    
    if rID_match and ctID_match:
        rID = rID_match.group(1)
        ctID = ctID_match.group(1)
        
        # Construct the download URL with appropriate parameters
        download_url = f"{base_url}?ctID={ctID}&rID={rID}&pID=MjMy&attchmnt=False&uSesDM=False&rIdx={rID}&rCFU="
        return download_url
    else:
        print(f"Unable to generate download link for {detail_url}")
        return None

def main():
    base_download_dir = "E:/Projects/Scraping"
    driver = webdriver.Chrome()
    try:
        driver.get('https://www.uwindsor.ca/registrar/')
        wait = WebDriverWait(driver, 20)
        # academic_calendars_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Academic Calendars")))
        # academic_calendars_link.click()
        # wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href$='.pdf']")))

        # # Diagnostic to see how many links are found on the page
        # all_pdfs = driver.find_elements(By.CSS_SELECTOR, "a[href$='.pdf']")
        # print(f"Total PDF links found: {len(all_pdfs)}")

        # # Specific handling for current and prior year PDFs
        # for pdf_link in all_pdfs:
        #     url = pdf_link.get_attribute('href')
        #     filename = url.split('/')[-1]
        #     print(f"Processing {url}")

        #     # Current year PDFs
        #     if '2025' in url:
        #         if "undergraduate" in url.lower():
        #             folder = setup_directory(base_download_dir, "Undergraduate Calendar (Winter 2025)")
        #         elif "graduate" in url.lower():
        #             folder = setup_directory(base_download_dir, "Graduate Calendar (Winter 2025)")
        #         download_pdf(url, folder)
        #     # Prior years PDFs
        #     else:
        #         year_match = re.search(r'\d{4}', filename)
        #         if year_match:
        #             year = year_match.group(0)
        #             if "undergraduate" in url.lower():
        #                 folder = setup_directory(base_download_dir, "Prior Undergraduate Calendars", year)
        #             elif "graduate" in url.lower():
        #                 folder = setup_directory(base_download_dir, "Prior Graduate Calendars", year)
        #             download_pdf(url, folder)

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
        for item in policyItems:
            # Locate the 3rd <td> within the <tr> of the <table>
            linkElement = item.find_element(By.XPATH, ".//table/tbody/tr/td[3]/a")
            linkText = linkElement.text
            linkHref = linkElement.get_attribute("href")

            print(linkText, linkHref)
            print("----------")

            # download_link = generate_download_link(linkHref)
            # print(download_link)
            
            # if download_link:
            #     # Set up a folder for downloads (you can customize this based on your needs)
            #     folder = setup_directory(base_download_dir, "University Policies")

            #     # Download the PDF file
            #     download_pdf(download_link, folder)

    finally:
        driver.quit()

if __name__ == "__main__":
    main()