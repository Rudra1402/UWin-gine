import os
import time
import requests
import re
import threading
import concurrent.futures
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

class PDFDownloader:
    """Handles downloading of PDFs, both static and dynamic."""
    def __init__(self, base_download_dir):
        self.base_download_dir = base_download_dir
        self.lock = threading.Lock()

    def setup_directory(self, *subfolders):
        """Creates nested subdirectories if they don't exist and returns the path."""
        folder_path = os.path.join(self.base_download_dir, *subfolders)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        return folder_path

    def download_pdf(self, url, folder):
        """Downloads a PDF from a URL and saves it to a specified folder if it doesn't already exist."""
        filename = url.split('/')[-1]
        file_path = os.path.join(folder, filename)

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

    def download_dynamic_pdf(self, url, folder, filename):
        """Downloads a dynamically generated PDF from a URL and saves it with a specified filename."""
        file_path = os.path.join(folder, filename)

        if os.path.exists(file_path):
            print(f"{filename} already exists in {folder}, skipping download.")
            return file_path

        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"Downloaded {filename} to {folder}")
            return file_path
        else:
            print(f"Failed to download from {url}. Status code: {response.status_code}")
            return None

class Scraper:
    """Handles the scraping process and parsing of Senate Policies and Bylaws."""
    def __init__(self):
        self.pdf_downloader = PDFDownloader("E:/Projects/Scraping")
        self.pdfs = []
        self.setup_webdriver()

    def setup_webdriver(self):
        """Initializes the Chrome webdriver with headless options."""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, 20)

    def fetch_policies(self, link_text):
        """Fetches details for either Senate Policies or Bylaws."""
        driver = self.driver.get('https://www.uwindsor.ca/registrar/')
        wait = WebDriverWait(driver, 20)
        uniPolicies = self.wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "University Bylaws & Policies")))
        uniPolicies.click()
        senatePolicies = self.wait.until(EC.element_to_be_clickable((By.LINK_TEXT, link_text)))
        senatePolicies.click()

        results_container = self.wait.until(EC.presence_of_element_located((By.ID, "ctPolicies-result-item-container")))
        print(len(results_container))
        policy_items = results_container.find_elements(By.CLASS_NAME, "citation-item-container")

        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [
                executor.submit(self.fetch_policy_summary, item, link_text) for item in policy_items
            ]
            concurrent.futures.wait(futures)

        print(f"Completed fetching {link_text}.")
        print(self.pdfs)

    def filter_active_policies(self):
        """Filters policies based on the 'Active' status."""
        try:
            # Locate the checkbox with different strategies (ID, CSS_SELECTOR, etc.)
            active_checkbox = self.wait.until(EC.element_to_be_clickable((By.ID, "lblSearch_231_Active")))
            active_checkbox.click()
            time.sleep(10)  # Adjust for page load

        except TimeoutException:
            print("TimeoutException: Unable to locate the 'Active' checkbox. Retrying with a different method...")

            # Attempt to locate the element using a different method if the ID approach fails
            try:
                active_checkbox = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[value='Active']")))
                active_checkbox.click()
                time.sleep(10)  # Adjust for page load
            except TimeoutException:
                print("TimeoutException: Could not locate 'Active' checkbox using alternative method. Please check the element's selector.")

    def fetch_policy_summary(self, item, policy_type):
        """Fetches the summary of an individual policy."""
        try:
            link_element = item.find_element(By.XPATH, ".//table/tbody/tr/td[3]/a")
            link_href = link_element.get_attribute("href")
            self.scrape_policy_details(link_href, policy_type)
        except Exception as e:
            print(f"Error processing policy: {e}")

    def scrape_policy_details(self, link_href, policy_type):
        """Opens the policy page and extracts necessary information."""
        try:
            self.driver.get(link_href)
            detail_section = self.wait.until(EC.presence_of_element_located((By.ID, "divDetailSummarySection")))
            subdiv = self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, "inmg-detail-table")))

            policy_data = {}
            subsubdivs = subdiv.find_elements(By.XPATH, "./div")
            for index, subsubdiv in enumerate(subsubdivs):
                if not subsubdiv.text.strip() or index in [len(subsubdivs) - 1, len(subsubdivs) - 2]:
                    continue
                elif index == len(subsubdivs) - 3:
                    pdf_link = subsubdiv.find_elements(By.CLASS_NAME, "File")[0].get_attribute("href")
                    policy_data["Live Link"] = pdf_link

                    # Download the PDF
                    folder = self.pdf_downloader.setup_directory(policy_type)
                    pdf_filename = f"{policy_type}_{re.search(r'rID=([^&]+)', pdf_link).group(1)}.pdf"
                    local_path = self.pdf_downloader.download_pdf(pdf_link, folder)
                    if local_path:
                        policy_data["Local Path"] = local_path
                else:
                    key = subsubdiv.find_element(By.CLASS_NAME, "control-display-label").text
                    value = subsubdiv.find_element(By.CLASS_NAME, "field-item-content-span").text
                    policy_data[key] = value

            self.pdfs.append(policy_data)

        except Exception as e:
            print(f"Error fetching details for {link_href}: {e}")


    def download_academic_calendars(self):
        """Downloads academic calendar PDFs."""
        self.driver.get('https://www.uwindsor.ca/registrar/')
        academic_calendars_link = self.wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Academic Calendars")))
        academic_calendars_link.click()

        pdf_links = self.driver.find_elements(By.CSS_SELECTOR, "a[href$='.pdf']")
        for pdf_link in pdf_links:
            url = pdf_link.get_attribute('href')
            self.process_academic_calendar_pdf(url)

    def process_academic_calendar_pdf(self, url):
        """Processes and downloads the PDF based on the type (undergraduate/graduate, current/prior)."""
        filename = url.split('/')[-1]
        if '2025' in url:
            if "undergraduate" in url.lower():
                folder = self.pdf_downloader.setup_directory("Undergraduate Calendar (Winter 2025)")
            else:
                folder = self.pdf_downloader.setup_directory("Graduate Calendar (Winter 2025)")
        else:
            year_match = re.search(r'\d{4}', filename)
            if year_match:
                year = year_match.group(0)
                if "undergraduate" in url.lower():
                    folder = self.pdf_downloader.setup_directory("Prior Undergraduate Calendars", year)
                else:
                    folder = self.pdf_downloader.setup_directory("Prior Graduate Calendars", year)

        self.pdf_downloader.download_pdf(url, folder)

    def scrape_policies(self):
        """Entry point to scrape Senate Policies and Bylaws."""
        self.fetch_policies("Senate Policies")
        self.fetch_policies("Senate Bylaws")

    def close(self):
        """Closes the webdriver."""
        self.driver.quit()

def main():
    scraper = Scraper()
    try:
        # scraper.download_academic_calendars()
        scraper.scrape_policies()
    finally:
        scraper.close()

if __name__ == "__main__":
    main()
