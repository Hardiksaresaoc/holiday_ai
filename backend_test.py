#!/usr/bin/env python3
"""
Holiday Explorer Backend API Test Suite
Tests all backend API endpoints comprehensively
"""

import requests
import json
import time
import sys
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@holidayexplorer.com"
ADMIN_PASSWORD = "admin123"

class HolidayExplorerAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.admin_token = None
        self.test_results = []
        self.package_ids = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method, endpoint, data=None, headers=None, params=None):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)
            
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=default_headers, params=params, timeout=30)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == 'PUT':
                response = requests.put(url, json=data, headers=default_headers, timeout=30)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=default_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            return None, str(e)
    
    def test_api_health(self):
        """Test 1: Basic API Health Check"""
        print("\n=== Testing API Health ===")
        
        response = self.make_request('GET', '/')
        if response is None:
            self.log_test("API Health Check", False, "Failed to connect to API", "Connection error")
            return False
            
        if response.status_code == 200:
            try:
                data = response.json()
                if 'message' in data and 'Holiday Explorer API' in data['message']:
                    self.log_test("API Health Check", True, "API is running and responding correctly")
                    return True
                else:
                    self.log_test("API Health Check", False, "API responding but unexpected format", data)
                    return False
            except json.JSONDecodeError:
                self.log_test("API Health Check", False, "API responding but invalid JSON", response.text)
                return False
        else:
            self.log_test("API Health Check", False, f"API returned status {response.status_code}", response.text)
            return False
    
    def test_admin_authentication(self):
        """Test 2: Admin Authentication"""
        print("\n=== Testing Admin Authentication ===")
        
        # Test login with correct credentials
        login_data = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        response = self.make_request('POST', '/auth/login', login_data)
        if response is None:
            self.log_test("Admin Login", False, "Failed to connect to login endpoint")
            return False
            
        if response.status_code == 200:
            try:
                data = response.json()
                if 'token' in data and 'user' in data:
                    self.admin_token = data['token']
                    user = data['user']
                    if user.get('role') == 'admin' and user.get('email') == ADMIN_EMAIL:
                        self.log_test("Admin Login", True, "Admin authentication successful")
                        
                        # Test invalid credentials
                        invalid_data = {"email": ADMIN_EMAIL, "password": "wrongpassword"}
                        invalid_response = self.make_request('POST', '/auth/login', invalid_data)
                        if invalid_response and invalid_response.status_code == 401:
                            self.log_test("Invalid Credentials Test", True, "Correctly rejected invalid credentials")
                        else:
                            self.log_test("Invalid Credentials Test", False, "Should reject invalid credentials")
                        
                        return True
                    else:
                        self.log_test("Admin Login", False, "User data incorrect", user)
                        return False
                else:
                    self.log_test("Admin Login", False, "Missing token or user in response", data)
                    return False
            except json.JSONDecodeError:
                self.log_test("Admin Login", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Admin Login", False, f"Login failed with status {response.status_code}", response.text)
            return False
    
    def test_packages_api(self):
        """Test 3: Packages API"""
        print("\n=== Testing Packages API ===")
        
        # Test getting all packages
        response = self.make_request('GET', '/packages')
        if response is None:
            self.log_test("Get All Packages", False, "Failed to connect to packages endpoint")
            return False
            
        if response.status_code == 200:
            try:
                packages = response.json()
                if isinstance(packages, list) and len(packages) > 0:
                    self.log_test("Get All Packages", True, f"Retrieved {len(packages)} packages")
                    
                    # Store package IDs for further testing
                    self.package_ids = [pkg.get('id') for pkg in packages if pkg.get('id')]
                    
                    # Validate package structure
                    first_package = packages[0]
                    required_fields = ['id', 'title', 'description', 'price', 'duration']
                    missing_fields = [field for field in required_fields if field not in first_package]
                    
                    if not missing_fields:
                        self.log_test("Package Structure Validation", True, "All required fields present")
                        
                        # Test getting individual package
                        if self.package_ids:
                            package_id = self.package_ids[0]
                            pkg_response = self.make_request('GET', f'/packages/{package_id}')
                            if pkg_response and pkg_response.status_code == 200:
                                pkg_data = pkg_response.json()
                                if pkg_data.get('id') == package_id:
                                    self.log_test("Get Individual Package", True, f"Retrieved package {package_id}")
                                else:
                                    self.log_test("Get Individual Package", False, "Package ID mismatch")
                            else:
                                self.log_test("Get Individual Package", False, "Failed to get individual package")
                        
                        # Test non-existent package
                        invalid_response = self.make_request('GET', '/packages/invalid-id')
                        if invalid_response and invalid_response.status_code == 404:
                            self.log_test("Invalid Package ID Test", True, "Correctly returned 404 for invalid package")
                        else:
                            self.log_test("Invalid Package ID Test", False, "Should return 404 for invalid package")
                        
                        return True
                    else:
                        self.log_test("Package Structure Validation", False, f"Missing fields: {missing_fields}")
                        return False
                else:
                    self.log_test("Get All Packages", False, "No packages found or invalid format", packages)
                    return False
            except json.JSONDecodeError:
                self.log_test("Get All Packages", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Get All Packages", False, f"Failed with status {response.status_code}", response.text)
            return False
    
    def test_payment_integration(self):
        """Test 4: Stripe Payment Integration"""
        print("\n=== Testing Payment Integration ===")
        
        if not self.package_ids:
            self.log_test("Payment Integration", False, "No package IDs available for testing")
            return False
        
        # Test creating checkout session with package
        package_id = self.package_ids[0]
        checkout_data = {
            "packageId": package_id,
            "customerInfo": {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "+91-9876543210"
            }
        }
        
        response = self.make_request('POST', '/payments/create-checkout', checkout_data)
        if response is None:
            self.log_test("Create Checkout Session", False, "Failed to connect to payment endpoint")
            return False
            
        if response.status_code == 200:
            try:
                data = response.json()
                if 'url' in data and 'sessionId' in data:
                    session_id = data['sessionId']
                    self.log_test("Create Checkout Session", True, f"Created session {session_id}")
                    
                    # Test retrieving session details
                    time.sleep(1)  # Brief delay for session creation
                    session_response = self.make_request('GET', f'/payments/session/{session_id}')
                    if session_response and session_response.status_code == 200:
                        session_data = session_response.json()
                        if 'status' in session_data and 'payment_status' in session_data:
                            self.log_test("Get Payment Session", True, f"Retrieved session details")
                        else:
                            self.log_test("Get Payment Session", False, "Missing session data fields")
                    else:
                        self.log_test("Get Payment Session", False, "Failed to retrieve session")
                    
                    # Test custom amount checkout
                    custom_data = {
                        "customAmount": 5000,
                        "customerInfo": {
                            "name": "Jane Smith",
                            "email": "jane.smith@example.com",
                            "phone": "+91-9876543211"
                        }
                    }
                    
                    custom_response = self.make_request('POST', '/payments/create-checkout', custom_data)
                    if custom_response and custom_response.status_code == 200:
                        self.log_test("Custom Amount Checkout", True, "Created custom amount session")
                    else:
                        self.log_test("Custom Amount Checkout", False, "Failed to create custom session")
                    
                    return True
                else:
                    self.log_test("Create Checkout Session", False, "Missing URL or session ID", data)
                    return False
            except json.JSONDecodeError:
                self.log_test("Create Checkout Session", False, "Invalid JSON response", response.text)
                return False
        else:
            self.log_test("Create Checkout Session", False, f"Failed with status {response.status_code}", response.text)
            return False
    
    def test_admin_endpoints(self):
        """Test 5: Admin Dashboard and Management"""
        print("\n=== Testing Admin Endpoints ===")
        
        if not self.admin_token:
            self.log_test("Admin Endpoints", False, "No admin token available")
            return False
        
        auth_headers = {'Authorization': f'Bearer {self.admin_token}'}
        
        # Test admin dashboard
        dashboard_response = self.make_request('GET', '/admin/dashboard', headers=auth_headers)
        if dashboard_response is None:
            self.log_test("Admin Dashboard", False, "Failed to connect to dashboard endpoint")
            return False
            
        if dashboard_response.status_code == 200:
            try:
                dashboard_data = dashboard_response.json()
                required_fields = ['totalPackages', 'totalBookings', 'totalRevenue']
                missing_fields = [field for field in required_fields if field not in dashboard_data]
                
                if not missing_fields:
                    self.log_test("Admin Dashboard", True, f"Dashboard data retrieved successfully")
                else:
                    self.log_test("Admin Dashboard", False, f"Missing dashboard fields: {missing_fields}")
            except json.JSONDecodeError:
                self.log_test("Admin Dashboard", False, "Invalid JSON response", dashboard_response.text)
        else:
            self.log_test("Admin Dashboard", False, f"Dashboard failed with status {dashboard_response.status_code}")
        
        # Test admin bookings
        bookings_response = self.make_request('GET', '/admin/bookings', headers=auth_headers)
        if bookings_response and bookings_response.status_code == 200:
            try:
                bookings_data = bookings_response.json()
                if isinstance(bookings_data, list):
                    self.log_test("Admin Bookings", True, f"Retrieved {len(bookings_data)} bookings")
                else:
                    self.log_test("Admin Bookings", False, "Bookings data not in list format")
            except json.JSONDecodeError:
                self.log_test("Admin Bookings", False, "Invalid JSON response")
        else:
            self.log_test("Admin Bookings", False, "Failed to retrieve bookings")
        
        # Test unauthorized access
        unauthorized_response = self.make_request('GET', '/admin/dashboard')
        if unauthorized_response and unauthorized_response.status_code == 401:
            self.log_test("Unauthorized Access Test", True, "Correctly blocked unauthorized access")
        else:
            self.log_test("Unauthorized Access Test", False, "Should block unauthorized access")
        
        # Test admin package creation
        new_package = {
            "title": "Test Package",
            "description": "A test package for API testing",
            "price": 9999,
            "duration": "3 Days / 2 Nights",
            "image": "https://example.com/test.jpg",
            "highlights": ["Test Feature 1", "Test Feature 2"],
            "rating": 4.5,
            "category": "test",
            "featured": False
        }
        
        create_response = self.make_request('POST', '/admin/packages', new_package, headers=auth_headers)
        if create_response and create_response.status_code == 200:
            try:
                created_package = create_response.json()
                if created_package.get('title') == new_package['title']:
                    self.log_test("Admin Package Creation", True, "Successfully created test package")
                    
                    # Test package update
                    package_id = created_package.get('id')
                    if package_id:
                        update_data = {"title": "Updated Test Package", "price": 11999}
                        update_response = self.make_request('PUT', f'/admin/packages/{package_id}', update_data, headers=auth_headers)
                        if update_response and update_response.status_code == 200:
                            self.log_test("Admin Package Update", True, "Successfully updated package")
                        else:
                            self.log_test("Admin Package Update", False, "Failed to update package")
                else:
                    self.log_test("Admin Package Creation", False, "Package data mismatch")
            except json.JSONDecodeError:
                self.log_test("Admin Package Creation", False, "Invalid JSON response")
        else:
            self.log_test("Admin Package Creation", False, "Failed to create package")
        
        return True
    
    def test_database_integration(self):
        """Test 6: Database Operations"""
        print("\n=== Testing Database Integration ===")
        
        # Database integration is tested implicitly through other tests
        # Check if data persists across requests
        
        # Get packages again to verify consistency
        response1 = self.make_request('GET', '/packages')
        time.sleep(1)
        response2 = self.make_request('GET', '/packages')
        
        if response1 and response2 and response1.status_code == 200 and response2.status_code == 200:
            try:
                packages1 = response1.json()
                packages2 = response2.json()
                
                if len(packages1) == len(packages2):
                    # Check if package IDs are consistent
                    ids1 = {pkg.get('id') for pkg in packages1}
                    ids2 = {pkg.get('id') for pkg in packages2}
                    
                    if ids1 == ids2:
                        self.log_test("Database Consistency", True, "Data consistent across requests")
                    else:
                        self.log_test("Database Consistency", False, "Data inconsistent across requests")
                else:
                    self.log_test("Database Consistency", False, "Package count changed between requests")
            except json.JSONDecodeError:
                self.log_test("Database Consistency", False, "JSON parsing error")
        else:
            self.log_test("Database Consistency", False, "Failed to test consistency")
        
        # Test MongoDB operations by checking if admin user exists
        if self.admin_token:
            self.log_test("MongoDB Connection", True, "MongoDB operations working (admin login successful)")
        else:
            self.log_test("MongoDB Connection", False, "MongoDB operations may have issues")
        
        return True
    
    def test_error_handling(self):
        """Test 7: Error Handling and Edge Cases"""
        print("\n=== Testing Error Handling ===")
        
        # Test invalid endpoints
        invalid_response = self.make_request('GET', '/invalid-endpoint')
        if invalid_response and invalid_response.status_code == 404:
            self.log_test("Invalid Endpoint", True, "Correctly returned 404 for invalid endpoint")
        else:
            self.log_test("Invalid Endpoint", False, "Should return 404 for invalid endpoints")
        
        # Test malformed JSON
        malformed_response = self.make_request('POST', '/auth/login', {"invalid": "data"})
        if malformed_response and malformed_response.status_code in [400, 401]:
            self.log_test("Malformed Request", True, "Correctly handled malformed request")
        else:
            self.log_test("Malformed Request", False, "Should handle malformed requests properly")
        
        # Test missing required fields
        incomplete_login = self.make_request('POST', '/auth/login', {"email": "test@example.com"})
        if incomplete_login and incomplete_login.status_code == 400:
            self.log_test("Missing Fields", True, "Correctly rejected incomplete data")
        else:
            self.log_test("Missing Fields", False, "Should reject incomplete data")
        
        # Test invalid payment data
        invalid_payment = self.make_request('POST', '/payments/create-checkout', {})
        if invalid_payment and invalid_payment.status_code == 400:
            self.log_test("Invalid Payment Data", True, "Correctly rejected invalid payment data")
        else:
            self.log_test("Invalid Payment Data", False, "Should reject invalid payment data")
        
        return True
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Holiday Explorer Backend API Tests")
        print(f"📍 Testing API at: {self.base_url}")
        print("=" * 60)
        
        test_functions = [
            self.test_api_health,
            self.test_admin_authentication,
            self.test_packages_api,
            self.test_payment_integration,
            self.test_admin_endpoints,
            self.test_database_integration,
            self.test_error_handling
        ]
        
        passed_tests = 0
        total_tests = len(self.test_results)
        
        for test_func in test_functions:
            try:
                test_func()
            except Exception as e:
                self.log_test(test_func.__name__, False, f"Test crashed: {str(e)}")
        
        # Calculate results
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"📈 Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        print("\n📋 DETAILED RESULTS:")
        for result in self.test_results:
            status = "✅" if result['success'] else "❌"
            print(f"{status} {result['test']}: {result['message']}")
        
        # Critical issues
        critical_failures = [r for r in self.test_results if not r['success'] and 
                           any(keyword in r['test'].lower() for keyword in ['health', 'auth', 'database'])]
        
        if critical_failures:
            print("\n🚨 CRITICAL ISSUES:")
            for failure in critical_failures:
                print(f"❌ {failure['test']}: {failure['message']}")
        
        return passed_tests, failed_tests, self.test_results

if __name__ == "__main__":
    tester = HolidayExplorerAPITester()
    passed, failed, results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if failed == 0 else 1)