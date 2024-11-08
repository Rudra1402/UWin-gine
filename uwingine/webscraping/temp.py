import os
import time
import requests
import re
import threading
import concurrent.futures
import json
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

class Scraper:
    def __init__(self, base_download_dir="doc"):
        self.base_download_dir = base_download_dir
        self.lock = threading.Lock()
        self.driver = self._setup_browser()
        self.wait = WebDriverWait(self.driver, 20)
        self.pdfs = []

    def _setup_browser(self):
        """Set up Chrome options for headless browsing."""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        return webdriver.Chrome(options=chrome_options)

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

    def download_dynamic_pdf(self, url, folder, filename, link_text):
        """Downloads a dynamically generated PDF and saves it with a specified filename."""
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
            os.rename(file_path, file_path.replace(filename, f"{link_text}.pdf"))
            return file_path
        else:
            print(f"Failed to download from {url}. Status code: {response.status_code}")
            return None

    def fetch_summary(self, link_href, link_text, text):
        """Opens a headless browser to fetch summary text from a detail page asynchronously."""
        try:
            driver = self._setup_browser()
            wait = WebDriverWait(driver, 20)

            driver.get(link_href)
            detail_section = wait.until(EC.presence_of_element_located((By.ID, "divDetailSummarySection")))
            detail_text = detail_section.text

            with self.lock:
                subdiv = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "inmg-detail-table")))
                subsubdivs = subdiv.find_elements(By.XPATH, "./div")
                
                d = {}
                for index, subsubdiv in enumerate(subsubdivs):
                    if not subsubdiv.text.strip():
                        continue
                    if index in (len(subsubdivs) - 1, len(subsubdivs) - 2):
                        continue
                    elif index == len(subsubdivs) - 3:
                        pdf_links = subsubdiv.find_elements(By.CLASS_NAME, "File")
                        link = pdf_links[0].get_attribute("href")
                        d["Live Link"] = link
                        folder = self.setup_directory(text)

                        rID_match = re.search(r'rID=([^&]+)', link)
                        if rID_match:
                            filename = f"Policy_{rID_match.group(1)}.pdf"
                            local_path = self.download_dynamic_pdf(link, folder, filename, link_text)
                            if local_path:
                                d["Local Path"] = local_path
                    else:
                        key = subsubdiv.find_element(By.CLASS_NAME, "control-display-label")                
                        value = subsubdiv.find_element(By.CLASS_NAME, "field-item-content-span")
                        d[key.text] = value.text
                        print(f"Key: {key.text}, value: {value.text}")
                
                self.pdfs.append(d)
        except Exception as e:
            print(f"Error accessing details for {link_text}: {e}")
        finally:
            driver.quit()

    def fetch_policies(self, link_text, link_href, text):
        """Handles policy items and their details concurrently."""
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [executor.submit(self.fetch_summary, link_href, link_text, text)]
            concurrent.futures.wait(futures)

    def get_academic_calendars(self):
        """Scrapes academic calendars from the website."""
        self.driver.get('https://www.uwindsor.ca/registrar/')
        academic_calendars_link = self.wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Academic Calendars")))
        academic_calendars_link.click()
        self.wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href$='.pdf']")))

        all_pdfs = self.driver.find_elements(By.CSS_SELECTOR, "a[href$='.pdf']")
        print(f"Total PDF links found: {len(all_pdfs)}")

        for pdf_link in all_pdfs:
            url = pdf_link.get_attribute('href')
            filename = url.split('/')[-1]
            print(f"Processing {url}")

            if '2025' in url:
                if "undergraduate" in url.lower():
                    folder = self.setup_directory("Undergraduate Calendar (Winter 2025)")
                elif "graduate" in url.lower():
                    folder = self.setup_directory("Graduate Calendar (Winter 2025)")
                self.download_pdf(url, folder)
            else:
                year_match = re.search(r'\d{4}', filename)
                if year_match:
                    year = year_match.group(0)
                    if "undergraduate" in url.lower():
                        folder = self.setup_directory("Prior Undergraduate Calendars", year)
                    elif "graduate" in url.lower():
                        folder = self.setup_directory("Prior Graduate Calendars", year)
                    self.download_pdf(url, folder)

    def scrape_academic_dates(self):
        """Scrapes the academic dates from a specific page and handles pagination."""
        base_url = 'https://www.uwindsor.ca/registrar/events-listing'
        self.driver.get(base_url)
        academic_dates = []
        
        while True:
            try:
                # Wait for the table containing the dates to load
                self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "table.views-table")))
                rows = self.driver.find_elements(By.CSS_SELECTOR, "table.views-table tbody tr")
                
                for row in rows:
                    date = row.find_element(By.CSS_SELECTOR, "td.views-field-field-event-date").text.strip()
                    event = row.find_element(By.CSS_SELECTOR, "td.views-field-title a").text.strip()
                    event_link = row.find_element(By.CSS_SELECTOR, "td.views-field-title a").get_attribute("href")
                    academic_dates.append({'date': date, 'event': event, 'event link': event_link })
                
                # Navigate to the next page if available
                next_page = self.driver.find_elements(By.CSS_SELECTOR, "ul.pagination li.next a")
                if next_page:
                    next_page_link = next_page[0].get_attribute('href')
                    self.driver.get(next_page_link)
                else:
                    break
            except Exception as e:
                print("Failed to scrape academic dates:", str(e))
                break

        folder_path = self.setup_directory("Important Academic Dates")
        self.save_to_json(academic_dates, folder_path, "Important_academic_dates")
           
        return academic_dates
    
    def save_to_json(self, data, folder, filename):
        #Saves data to a JSON file in the specified folder.

            # Get current date in YYYY-MM-DD format
            current_date = datetime.now().strftime("%y%m%d")
            # Append the date to the filename
            dated_filename = f"{filename}_{current_date}.json"
        
            file_path = os.path.join(folder, dated_filename)
            with open(file_path, 'w', encoding='utf-8') as json_file:
                json.dump(data, json_file, ensure_ascii=False, indent=4)

    def get_senate_policies(self, text):
        """Scrapes senate policies from the website."""
        self.driver.get("https://www.uwindsor.ca/registrar/")
        self.wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "University Bylaws & Policies"))).click()
        self.wait.until(EC.element_to_be_clickable((By.LINK_TEXT, text))).click()

        active_checkbox = self.wait.until(EC.element_to_be_clickable((By.ID, "lblSearch_231_Active")))
        active_checkbox.click()

        time.sleep(10)
        results_container = self.wait.until(EC.presence_of_element_located((By.ID, "ctPolicies-result-item-container")))
        policy_items = results_container.find_elements(By.CLASS_NAME, "citation-item-container")

        for item in policy_items:
            try:
                link_element = item.find_element(By.XPATH, ".//table/tbody/tr/td[3]/a")
                link_text = link_element.text
                link_href = link_element.get_attribute("href")
                self.fetch_policies(link_text, link_href, text)
            except Exception as e:
                print(f"Error processing policy: {e}")

    def close(self):
        """Close the WebDriver."""
        self.driver.quit()

def main():
    scraper = Scraper()

    try:
        # Scrape academic calendars
        scraper.get_academic_calendars()

        # Scrape senate policies
        scraper.get_senate_policies("Senate Policies")
        scraper.get_senate_policies("Senate Bylaws")

        # Scrape academic dates
        scraper.scrape_academic_dates()
        print("All scraping tasks completed!")
        
    finally:
        scraper.close()
        
if __name__ == "__main__":
    main()
