<template>
  <div class="app-container">
    
    <!-- Login Screen -->
    <div v-if="!currentUser" class="login-wrapper">
      <div class="login-card glass-effect">
        <div class="login-header">
          <div class="logo">
            <span class="logo-icon">📊</span>
            <h1>نظام الأسعار</h1>
          </div>
          <p class="subtitle">نظام إدارة الأسعار الاحترافي</p>
        </div>
        
        <div class="login-form">
          <div class="input-group">
            <label>اسم المستخدم</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input 
                v-model="loginForm.username" 
                placeholder="أدخل اسم المستخدم" 
                class="auth-input"
              />
            </div>
          </div>
          
          <div class="input-group">
            <label>كلمة المرور</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="أدخل كلمة المرور" 
                class="auth-input"
              />
            </div>
          </div>
          
          <button @click="handleLogin" class="login-btn" :disabled="!loginForm.username || !loginForm.password">
            <span>تسجيل الدخول</span>
            <span class="btn-icon">→</span>
          </button>
          
          <p v-if="loginError" class="error-message">{{ loginError }}</p>
        </div>
      </div>
    </div>

    <!-- Main App -->
    <div v-else class="main-app">
      <!-- Success Message Toast -->
      <div v-if="showMessage" class="success-toast">
        <div class="toast-content">
          <span class="toast-icon">✅</span>
          <span class="toast-message">{{ successMessage }}</span>
        </div>
      </div>
      
      <!-- Modern Header -->
      <header class="app-header">
        <div class="header-content">
          <div class="brand">
            <div class="brand-logo">📊</div>
            <div class="brand-text">
              <h2>نظام الأسعار</h2>
              <p>الإدارة الاحترافية</p>
            </div>
          </div>
          
          <div class="user-panel">
            <div class="user-badge">
              <div class="user-avatar">
                <span>{{ currentUser.username.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="user-details">
                <span class="username">{{ currentUser.username }}</span>
                <span class="user-role">{{ currentUser.role === 'admin' ? 'مدير النظام' : 'موظف' }}</span>
              </div>
            </div>
            <button @click="logout" class="logout-btn">
              <span>تسجيل خروج</span>
              <span class="logout-icon">🚪</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Admin Dashboard -->
      <div v-if="currentUser.role === 'admin'" class="dashboard">
        <div class="dashboard-header">
          <h2>لوحة التحكم الإدارية</h2>
          <div class="stats-cards">
            <div class="stat-card">
              <span class="stat-value">{{ products.length }}</span>
              <span class="stat-label">السلع</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">2</span>
              <span class="stat-label">الإداريين</span>
            </div>
          </div>
        </div>
        
        <div class="tab-navigation">
          <button 
            @click="adminTab = 'products'" 
            :class="['tab-btn', { active: adminTab === 'products' }]"
          >
            <span class="tab-icon">📦</span>
            <span>إدارة السلع</span>
          </button>
          <button 
            @click="adminTab = 'users'" 
            :class="['tab-btn', { active: adminTab === 'users' }]"
          >
            <span class="tab-icon">👥</span>
            <span>إدارة المستخدمين</span>
          </button>
        </div>

        <!-- Products Management -->
        <div v-if="adminTab === 'products'" class="management-section">
          <div class="section-header">
            <h3>إدارة السلع</h3>
            <p>إضافة وتعديل وحذف السلع من النظام</p>
          </div>
          
          <div class="product-form glass-card">
            <div class="form-row">
              <div class="form-group">
                <label>اسم السلعة</label>
                <input 
                  v-model="newItem.name" 
                  placeholder="أدخل اسم السلعة" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>السعر (د.ع)</label>
                <input 
                  v-model="newItem.price" 
                  type="number" 
                  placeholder="أدخل السعر" 
                  class="form-input"
                />
              </div>
            </div>
            
            <div class="form-actions">
              <button v-if="!isEditing" @click="addProduct" class="action-btn primary">
                <span class="btn-icon">➕</span>
                <span>إضافة سلعة</span>
              </button>
              <div v-else class="edit-actions">
                <button @click="updateProduct" class="action-btn warning">
                  <span class="btn-icon">💾</span>
                  <span>حفظ التعديل</span>
                </button>
                <button @click="cancelEdit" class="action-btn secondary">
                  <span class="btn-icon">❌</span>
                  <span>إلغاء</span>
                </button>
              </div>
            </div>
          </div>
          
          <div class="data-table glass-card">
            <div class="table-header">
              <h4>قائمة السلع</h4>
              <span class="item-count">{{ products.length }} سلعة</span>
            </div>
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>م</th>
                    <th>اسم السلعة</th>
                    <th>السعر</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, index) in products" :key="product.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <div class="product-name">
                        <span class="product-icon">📦</span>
                        {{ product.name }}
                      </div>
                    </td>
                    <td>
                      <span class="price-tag">{{ formatPrice(product.price) }}</span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button @click="startEdit(product)" class="icon-btn edit">
                          ✏️
                        </button>
                        <button @click="deleteProduct(product.id)" class="icon-btn delete">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Users Management -->
        <div v-if="adminTab === 'users'" class="management-section">
          <div class="section-header">
            <h3>إدارة المستخدمين</h3>
            <p>إنشاء حسابات جديدة وحذف المستخدمين</p>
          </div>
          
          <div class="user-form glass-card">
            <div class="form-row">
              <div class="form-group">
                <label>اسم المستخدم</label>
                <input 
                  v-model="newUser.username" 
                  placeholder="أدخل اسم المستخدم" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>كلمة المرور</label>
                <input 
                  v-model="newUser.password" 
                  type="password" 
                  placeholder="أدخل كلمة المرور" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>الوظيفة</label>
                <select v-model="newUser.role" class="form-select">
                  <option value="employee">موظف</option>
                  <option value="admin">مدير</option>
                </select>
              </div>
            </div>
            
            <button @click="createUser" class="action-btn primary full-width">
              <span class="btn-icon">👤</span>
              <span>إنشاء حساب جديد</span>
            </button>
          </div>
          
          <div class="users-list glass-card">
            <div class="table-header">
              <h4>قائمة المستخدمين</h4>
              <span class="item-count">{{ users.length }} مستخدم</span>
            </div>
            
            <div v-if="usersLoading" class="loading-state">
              <div class="spinner"></div>
              <p>جاري تحميل المستخدمين...</p>
            </div>
            
            <div v-else class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>م</th>
                    <th>اسم المستخدم</th>
                    <th>الوظيفة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, index) in users" :key="user.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <div class="user-name">
                        <span class="user-avatar-small">
                          {{ user.username.charAt(0).toUpperCase() }}
                        </span>
                        {{ user.username }}
                      </div>
                    </td>
                    <td>
                      <span :class="['role-badge', user.role]">
                        {{ user.role === 'admin' ? 'مدير' : 'موظف' }}
                      </span>
                    </td>
                    <td>
                      <button 
                        @click="deleteUser(user.id)" 
                        class="icon-btn delete"
                        :disabled="user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1"
                        :title="user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1 ? 'لا يمكن حذف المدير الوحيد' : 'حذف المستخدم'"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee View -->
      <div v-if="currentUser.role === 'employee'" class="employee-view">
        <div class="search-section glass-card">
          <div class="search-header">
            <h3>بحث الأسعار</h3>
            <p>ابحث عن السلع واطلع على الأسعار الحالية</p>
          </div>
          
          <div class="search-box">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input 
                v-model="searchQuery" 
                @input="fetchProducts" 
                placeholder="ابحث عن اسم السلعة..." 
                class="search-input"
              />
            </div>
          </div>
        </div>
        
        <div class="results-section">
          <div class="results-header">
            <h4>نتائج البحث</h4>
            <span class="results-count" v-if="products.length > 0">{{ products.length }} نتائج</span>
          </div>
          
          <div class="products-grid" v-if="products.length > 0">
            <div 
              v-for="product in products" 
              :key="product.id" 
              class="product-card glass-card"
            >
              <div class="product-icon-large">📦</div>
              <h5 class="product-name-large">{{ product.name }}</h5>
              <div class="price-display">
                <span class="price-amount">{{ formatPrice(product.price) }}</span>
                <span class="currency">دينار عراقي</span>
              </div>
            </div>
          </div>
          
          <div v-else class="no-results">
            <div class="no-results-icon">📋</div>
            <h4>لا توجد نتائج</h4>
            <p>حاول استخدام كلمات مفتاحية مختلفة في البحث</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// === State ===
const currentUser = ref(null) // null = غير مسجل
const loginForm = ref({ username: '', password: '' })
const loginError = ref('')
const adminTab = ref('products') // 'products' or 'users'

// بيانات السلع
const products = ref([])
const searchQuery = ref('')
const newItem = ref({ id: null, name: '', price: '' })
const isEditing = ref(false)

// بيانات إنشاء مستخدم
const newUser = ref({ username: '', password: '', role: 'employee' })

// بيانات المستخدمين
const users = ref([])
const usersLoading = ref(false)

// Success messages
const successMessage = ref('')
const showMessage = ref(false)

// === Auth Functions ===
async function handleLogin() {
  loginError.value = ''
  try {
    const user = await $fetch('/api/login', {
      method: 'POST',
      body: loginForm.value
    })
    currentUser.value = user
    if (user) {
      fetchProducts()
      if (user.role === 'admin') {
        fetchUsers()
      }
    }
  } catch (err) {
    loginError.value = 'خطأ في اسم المستخدم أو كلمة المرور'
  }
}

async function logout() {
  try {
    await $fetch('/api/session', { method: 'DELETE' })
  } catch (e) {
    // Ignore errors on logout
  }
  currentUser.value = null
  loginForm.value = { username: '', password: '' }
  products.value = []
  users.value = []
}

async function createUser() {
  if (!newUser.value.username || !newUser.value.password) return alert('أدخل البيانات كاملة')
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: newUser.value
    })
    newUser.value = { username: '', password: '', role: 'employee' }
    await fetchUsers() // Wait for refresh to complete
    showSuccessMessage('تم إنشاء المستخدم بنجاح!')
  } catch (err) {
    alert('حدث خطأ، ربما الاسم مستخدم مسبقاً')
  }
}

// === Utility Functions ===
function formatPrice(price) {
  return new Intl.NumberFormat('ar-IQ').format(price) + ' د.ع'
}

// === Product Functions ===
async function fetchProducts() {
  const { data } = await useFetch('/api/products', {
    query: { search: searchQuery.value }
  })
  products.value = data.value || []
}

// === User Management Functions ===
async function fetchUsers() {
  if (currentUser.value?.role !== 'admin') return
  
  usersLoading.value = true
  try {
    const data = await $fetch('/api/users')
    users.value = data || []
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    usersLoading.value = false
  }
}

async function deleteUser(userId) {
  if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return
  
  try {
    await $fetch('/api/users', {
      method: 'DELETE',
      body: { id: userId }
    })
    await fetchUsers() // Wait for refresh to complete
    showSuccessMessage('تم حذف المستخدم بنجاح!')
  } catch (err) {
    alert(err.data?.message || 'حدث خطأ أثناء حذف المستخدم')
  }
}

// === Session Management ===
async function checkSession() {
  try {
    const user = await $fetch('/api/session')
    if (user) {
      currentUser.value = user
      fetchProducts()
      if (user.role === 'admin') {
        fetchUsers()
      }
    }
  } catch (err) {
    
  }
}


function showSuccessMessage(message) {
  successMessage.value = message
  showMessage.value = true
  

  setTimeout(() => {
    showMessage.value = false
  }, 3000)
}

async function addProduct() {
  if (!newItem.value.name || !newItem.value.price) return alert('بيانات ناقصة')
  try {
    await $fetch('/api/products', { method: 'POST', body: newItem.value })
    newItem.value = { id: null, name: '', price: '' }
    await fetchProducts() // Refresh products list
    showSuccessMessage('تمت إضافة السلعة بنجاح!')
    // Scroll to top to show the new item
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    alert('حدث خطأ أثناء إضافة السلعة')
  }
}

async function deleteProduct(id) {
  if (!confirm('تأكيد الحذف؟')) return
  try {
    await $fetch('/api/products', { method: 'DELETE', body: { id } })
    await fetchProducts() // Wait for refresh to complete
    showSuccessMessage('تم حذف السلعة بنجاح!')
  } catch (err) {
    alert('حدث خطأ أثناء حذف السلعة')
  }
}

function startEdit(product) {
  newItem.value = { ...product }
  isEditing.value = true
}

async function updateProduct() {
  try {
    await $fetch('/api/products', { method: 'PUT', body: newItem.value })
    cancelEdit()
    await fetchProducts() // Refresh products list
    showSuccessMessage('تم تحديث السلعة بنجاح!')
    // Scroll to top to show the updated item
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    alert('حدث خطأ أثناء تحديث السلعة')
  }
}

function cancelEdit() {
  isEditing.value = false
  newItem.value = { id: null, name: '', price: '' }
}

onMounted(() => {
  checkSession()
})
</script>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  direction: rtl;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  min-height: 100vh;
  color: #f8fafc; /* Light text for better contrast */
}

/* App Container */
.app-container {
  min-height: 100vh;
  padding: 16px;
  position: relative;
}

/* Success Toast */
.success-toast {
  position: fixed;
  top: 16px;
  right: 16px;
  left: 16px;
  z-index: 1000;
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  color: white;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 10px 25px rgba(8, 145, 178, 0.3);
  animation: slideIn 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
}

.toast-message {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Glass Effect */
.glass-effect {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.15);
}

glass-card {
  background: rgba(255, 255, 255, 0.99);
  backdrop-filter: blur(25px);
  border-radius: 20px;
  border: 1px solid rgba(241, 245, 249, 0.9);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  padding: 24px;
  margin-bottom: 20px;
}

/* Login Screen */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  background: rgba(255, 255, 255, 0.99);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(241, 245, 249, 0.8);
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.15);
}

.login-header {
  margin-bottom: 32px;
}

.logo {
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 2.8rem;
  display: block;
  margin-bottom: 12px;
  color: #0f172a;
}

.login-header h1 {
  color: #0f172a;
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #334155;
  font-size: 1rem;
  font-weight: 500;
}

.login-form {
  text-align: right;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  color: #0f172a;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 0.9rem;
  text-align: right;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 16px;
  font-size: 1.1rem;
  color: #94a3b8;
  z-index: 2;
}

.auth-input {
  width: 100%;
  padding: 16px 50px 16px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  background: #ffffff;
  font-size: 1rem;
  transition: all 0.2s ease;
  font-weight: 500;
}

.auth-input:focus {
  outline: none;
  border-color: #0f172a;
  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1);
  background: #f8fafc;
}

.login-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  margin-top: 12px;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.3);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.4);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.2);
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.error-message {
  color: #dc2626;
  margin-top: 16px;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 600;
  background: #fef2f2;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #fecaca;
}

/* Main App */
.main-app {
  max-width: 1200px;
  margin: 0 auto;
}

/* App Header */
.app-header {
  background: rgba(255, 255, 255, 0.99);
  backdrop-filter: blur(25px);
  border-radius: 20px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(241, 245, 249, 0.8);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 15px;
}

.brand-logo {
  font-size: 2.2rem;
  color: #0f172a;
}

.brand-text h2 {
  color: #0f172a;
  font-size: 1.5rem;
  margin-bottom: 2px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.brand-text p {
  color: #334155;
  font-size: 0.85rem;
  font-weight: 500;
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.2);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 700;
  color: #0f172a;
  font-size: 1rem;
}

.user-role {
  color: #334155;
  font-size: 0.8rem;
  font-weight: 500;
}

.logout-btn {
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.2);
}

.logout-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(220, 38, 38, 0.3);
}

/* Dashboard */
.dashboard {
  margin-bottom: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.dashboard-header h2 {
  color: #f1f5f9;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.stats-cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(25px);
  border-radius: 16px;
  padding: 16px 20px;
  text-align: center;
  min-width: 100px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.1);
}

.stat-value {
  display: block;
  font-size: 1.6rem;
  font-weight: 800;
  color: #f1f5f9;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}

.stat-label {
  color: #e2e8f0;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.3);
  padding: 6px;
  border-radius: 18px;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 12px 20px;
  border-radius: 14px;
  color: #e2e8f0;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.tab-btn.active {
  background: white;
  color: #0f172a;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
  transform: translateY(-1px);
}

.tab-icon {
  font-size: 1.2rem;
}

/* Management Sections */
.management-section {
  margin-bottom: 24px;
}

.section-header {
  margin-bottom: 24px;
  text-align: center;
}

.section-header h3 {
  color: #f1f5f9;
  font-size: 1.4rem;
  margin-bottom: 8px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.section-header p {
  color: #e2e8f0;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Forms */
.product-form, .user-form {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.form-input, .form-select {
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  font-weight: 500;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #0f172a;
  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1);
  background: #f8fafc;
}

.form-select {
  background: white;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.edit-actions {
  display: flex;
  gap: 15px;
}

/* Action Buttons */
.action-btn {
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.1);
}

.action-btn.primary {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(15, 23, 42, 0.2);
}

.action-btn.warning {
  background: #d97706;
  color: white;
}

.action-btn.warning:hover {
  background: #b45309;
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(217, 119, 6, 0.3);
}

.action-btn.secondary {
  background: #64748b;
  color: white;
}

.action-btn.secondary:hover {
  background: #475569;
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(100, 116, 139, 0.3);
}

.action-btn.full-width {
  width: 100%;
  justify-content: center;
}

/* Data Table */
.data-table {
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.table-header h4 {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
}

.item-count {
  background: #e0f2fe;
  color: #0284c7;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
}

table thead {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
}

table th {
  padding: 16px 20px;
  text-align: right;
  font-weight: 700;
  font-size: 0.9rem;
}

table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  color: #0f172a;
  font-weight: 500;
}

table tbody tr:hover {
  background: #f8fafc;
}

table tbody tr:last-child td {
  border-bottom: none;
}

.product-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.product-icon {
  font-size: 1.3rem;
  color: #94a3b8;
}

.price-tag {
  background: #dcfce7;
  color: #15803d;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  font-weight: bold;
}

.icon-btn.edit {
  background: #e0f2fe;
  color: #0284c7;
}

.icon-btn.edit:hover {
  background: #bae6fd;
  transform: scale(1.05);
}

.icon-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.icon-btn.delete:hover {
  background: #fecaca;
  transform: scale(1.05);
}

/* Info Note */
.info-note {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: #fff8e1;
  border: 1px solid #ffecb3;
}

.note-icon {
  font-size: 1.5rem;
  margin-top: 3px;
}

.note-content h4 {
  color: #ff8f00;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.note-content p {
  color: #996600;
  line-height: 1.5;
}

/* Employee View */
.employee-view {
  max-width: 800px;
  margin: 0 auto;
}

.search-section {
  margin-bottom: 24px;
}

.search-header {
  text-align: center;
  margin-bottom: 24px;
}

.search-header h3 {
  color: #0f172a;
  font-size: 1.4rem;
  margin-bottom: 8px;
  font-weight: 800;
}

.search-header p {
  color: #334155;
  font-size: 0.95rem;
  font-weight: 500;
}

.search-box {
  max-width: 100%;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  right: 16px;
  font-size: 1.2rem;
  color: #94a3b8;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 16px 50px 16px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 1rem;
  transition: all 0.2s ease;
  font-weight: 500;
}

.search-input:focus {
  outline: none;
  border-color: #0f172a;
  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1);
  background: #f8fafc;
}

.results-section {
  margin-top: 24px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-header h4 {
  color: #f1f5f9;
  font-size: 1.2rem;
  font-weight: 700;
}

.results-count {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.product-card {
  text-align: center;
  padding: 24px 20px;
  transition: all 0.2s ease;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(241, 245, 249, 0.8);
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
}

.product-icon-large {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: #94a3b8;
}

.product-name-large {
  color: #0f172a;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.price-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.price-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.currency {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Users List */
.users-list {
  margin-top: 24px;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.user-avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.2);
}

.role-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.role-badge.admin {
  background: #e0f2fe;
  color: #0284c7;
}

.role-badge.employee {
  background: #dcfce7;
  color: #15803d;
}

.loading-state {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #0f172a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748b;
  font-size: 1rem;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 50px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.no-results-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  opacity: 0.8;
  color: white;
}

.no-results h4 {
  color: #f1f5f9;
  font-size: 1.3rem;
  margin-bottom: 12px;
  font-weight: 700;
}

.no-results p {
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-container {
    padding: 12px;
  }
  
  .success-toast {
    left: 12px;
    right: 12px;
    top: 12px;
    padding: 14px 16px;
  }
  
  .login-card {
    padding: 24px;
    max-width: 100%;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .stats-cards {
    width: 100%;
    justify-content: center;
  }
  
  .tab-navigation {
    width: 100%;
    flex-direction: column;
    gap: 6px;
  }
  
  .tab-btn {
    justify-content: center;
    padding: 14px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .action-buttons {
    flex-direction: row;
    gap: 8px;
    justify-content: center;
  }
  
  .icon-btn {
    width: 42px;
    height: 42px;
  }
  
  table {
    font-size: 0.85rem;
  }
  
  table th, table td {
    padding: 12px 16px;
  }
  
  .user-panel {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  
  .logout-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>