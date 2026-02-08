<template>
  <div class="app-container">
    
    <!-- Login Screen -->
    <div v-if="!currentUser" class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-circle">
            <span class="logo-icon">💰</span>
          </div>
          <h1>نظام الأسعار</h1>
          <p class="subtitle">نظام إدارة احترافي</p>
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
            <span class="btn-arrow">←</span>
          </button>
          
          <p v-if="loginError" class="error-message">{{ loginError }}</p>
        </div>
      </div>
    </div>

    <!-- Main App -->
    <div v-else class="main-app">
      <!-- Success Toast -->
      <div v-if="showMessage" class="success-toast">
        <span class="toast-icon">✓</span>
        <span class="toast-text">{{ successMessage }}</span>
      </div>
      
      <!-- Modern Header -->
      <header class="app-header">
        <div class="header-top">
          <div class="brand">
            <div class="brand-icon">💰</div>
            <div class="brand-text">
              <h2>نظام الأسعار</h2>
              <p>الإدارة الذكية</p>
            </div>
          </div>
          <button @click="logout" class="logout-btn">
            <span class="logout-icon">⏻</span>
          </button>
        </div>
        
        <div class="user-info">
          <div class="user-avatar">
            {{ currentUser.username.charAt(0).toUpperCase() }}
          </div>
          <div class="user-details">
            <span class="username">{{ currentUser.username }}</span>
            <span class="user-role">{{ currentUser.role === 'admin' ? '👑 مدير' : '👤 موظف' }}</span>
          </div>
        </div>
      </header>

      <!-- Admin Dashboard -->
      <div v-if="currentUser.role === 'admin'" class="dashboard">
        <!-- Stats Cards -->
        <div class="stats-section">
          <div class="stat-card primary">
            <div class="stat-icon">📦</div>
            <div class="stat-info">
              <span class="stat-value">{{ products.length }}</span>
              <span class="stat-label">السلع</span>
            </div>
          </div>
          <div class="stat-card secondary">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <span class="stat-value">{{ users.length }}</span>
              <span class="stat-label">المستخدمين</span>
            </div>
          </div>
        </div>
        
        <!-- Tab Navigation -->
        <div class="tab-nav">
          <button 
            @click="adminTab = 'products'" 
            :class="['tab-btn', { active: adminTab === 'products' }]"
          >
            <span class="tab-icon">📦</span>
            <span>السلع</span>
          </button>
          <button 
            @click="adminTab = 'users'" 
            :class="['tab-btn', { active: adminTab === 'users' }]"
          >
            <span class="tab-icon">👥</span>
            <span>المستخدمين</span>
          </button>
        </div>

        <!-- Products Management -->
        <div v-if="adminTab === 'products'" class="content-section">
          <div class="section-title">
            <h3>إدارة السلع</h3>
          </div>
          
          <!-- Search Box -->
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input 
              v-model="searchQuery" 
              @input="fetchProducts" 
              placeholder="ابحث عن السلعة..." 
              class="search-input"
            />
          </div>
          
          <!-- Product Form -->
          <div class="form-card">
            <div class="form-group">
              <label>اسم السلعة</label>
              <input 
                v-model="newItem.name" 
                placeholder="مثال: رز هندي" 
                class="form-input"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>المفرد (د.ع)</label>
                <input 
                  v-model="newItem.price" 
                  type="number" 
                  placeholder="0" 
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>الجملة (د.ع)</label>
                <input 
                  v-model="newItem.wholesalePrice" 
                  type="number" 
                  placeholder="0" 
                  class="form-input"
                />
              </div>
            </div>
            
            <button v-if="!isEditing" @click="addProduct" class="submit-btn add">
              <span class="btn-icon">+</span>
              <span>إضافة سلعة</span>
            </button>
            <div v-else class="edit-btns">
              <button @click="updateProduct" class="submit-btn update">
                <span class="btn-icon">✓</span>
                <span>حفظ</span>
              </button>
              <button @click="cancelEdit" class="submit-btn cancel">
                <span class="btn-icon">×</span>
                <span>إلغاء</span>
              </button>
            </div>
          </div>
          
          <!-- Products List -->
          <div class="products-list">
            <div class="list-header">
              <h4>قائمة السلع</h4>
              <span class="count-badge">{{ products.length }}</span>
            </div>
            
            <div v-if="products.length === 0" class="empty-state">
              <div class="empty-icon">📦</div>
              <p>لا توجد سلع</p>
            </div>
            
            <div v-else class="product-item" v-for="product in products" :key="product.id">
              <div class="product-info">
                <div class="product-header">
                  <span class="product-icon">📦</span>
                  <h5>{{ product.name }}</h5>
                </div>
                <div class="product-prices">
                  <div class="price-tag retail">
                    <span class="price-label">المفرد</span>
                    <span class="price-value">{{ formatPrice(product.price) }}</span>
                  </div>
                  <div class="price-tag wholesale">
                    <span class="price-label">الجملة</span>
                    <span class="price-value">{{ formatPrice(product.wholesalePrice) }}</span>
                  </div>
                </div>
              </div>
              <div class="product-actions">
                <button @click="startEdit(product)" class="action-btn edit">
                  ✏️
                </button>
                <button @click="deleteProduct(product.id)" class="action-btn delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Management -->
        <div v-if="adminTab === 'users'" class="content-section">
          <div class="section-title">
            <h3>إدارة المستخدمين</h3>
          </div>
          
          <!-- User Form -->
          <div class="form-card">
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
            
            <button @click="createUser" class="submit-btn add">
              <span class="btn-icon">+</span>
              <span>إنشاء حساب</span>
            </button>
          </div>
          
          <!-- Users List -->
          <div class="users-list">
            <div class="list-header">
              <h4>قائمة المستخدمين</h4>
              <span class="count-badge">{{ users.length }}</span>
            </div>
            
            <div v-if="usersLoading" class="loading">
              <div class="spinner"></div>
              <p>جاري التحميل...</p>
            </div>
            
            <div v-else class="user-item" v-for="user in users" :key="user.id">
              <div class="user-avatar-small">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
              <div class="user-info-item">
                <span class="user-name">{{ user.username }}</span>
                <span :class="['role-tag', user.role]">
                  {{ user.role === 'admin' ? '👑 مدير' : '👤 موظف' }}
                </span>
              </div>
              <button 
                @click="deleteUser(user.id)" 
                class="action-btn delete"
                :disabled="user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee View -->
      <div v-if="currentUser.role === 'employee'" class="employee-view">
        <!-- Search Section -->
        <div class="search-section">
          <h3>🔍 بحث الأسعار</h3>
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input 
              v-model="searchQuery" 
              @input="fetchProducts" 
              placeholder="ابحث عن اسم السلعة..." 
              class="search-input"
            />
          </div>
        </div>
        
        <!-- Results -->
        <div class="results-section">
          <div class="results-header">
            <h4>النتائج</h4>
            <span class="count-badge" v-if="products.length > 0">{{ products.length }}</span>
          </div>
          
          <div v-if="products.length === 0" class="empty-state">
            <div class="empty-icon">🔍</div>
            <p>لا توجد نتائج</p>
            <span class="empty-hint">جرب البحث بكلمات أخرى</span>
          </div>
          
          <div v-else class="product-card" v-for="product in products" :key="product.id">
            <div class="card-icon">📦</div>
            <h5 class="card-title">{{ product.name }}</h5>
            <div class="card-prices">
              <div class="price-box retail">
                <span class="box-label">المفرد</span>
                <span class="box-value">{{ formatPrice(product.price) }}</span>
              </div>
              <div class="price-box wholesale">
                <span class="box-label">الجملة</span>
                <span class="box-value">{{ formatPrice(product.wholesalePrice) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// State
const currentUser = ref(null)
const loginForm = ref({ username: '', password: '' })
const loginError = ref('')
const adminTab = ref('products')
const products = ref([])
const searchQuery = ref('')
const newItem = ref({ id: null, name: '', price: '', wholesalePrice: '' })
const isEditing = ref(false)
const newUser = ref({ username: '', password: '', role: 'employee' })
const users = ref([])
const usersLoading = ref(false)
const successMessage = ref('')
const showMessage = ref(false)

// Auth Functions
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
  } catch (e) {}
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
    await fetchUsers()
    showSuccessMessage('تم إنشاء المستخدم بنجاح!')
  } catch (err) {
    alert('حدث خطأ، ربما الاسم مستخدم مسبقاً')
  }
}

// Utility Functions
function formatPrice(price) {
  if (!price) return '0 د.ع'
  return new Intl.NumberFormat('ar-IQ').format(price) + ' د.ع'
}

// Product Functions
async function fetchProducts() {
  const { data } = await useFetch('/api/products', {
    query: { search: searchQuery.value }
  })
  products.value = data.value || []
}

// User Management
async function fetchUsers() {
  if (currentUser.value?.role !== 'admin') return
  usersLoading.value = true
  try {
    const data = await $fetch('/api/users')
    users.value = data || []
  } catch (err) {
    console.error('Error:', err)
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
    await fetchUsers()
    showSuccessMessage('تم حذف المستخدم بنجاح!')
  } catch (err) {
    alert(err.data?.message || 'حدث خطأ')
  }
}

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
  } catch (err) {}
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
    newItem.value = { id: null, name: '', price: '', wholesalePrice: '' }
    await fetchProducts()
    showSuccessMessage('تمت إضافة السلعة بنجاح!')
  } catch (err) {
    alert('حدث خطأ')
  }
}

async function deleteProduct(id) {
  if (!confirm('تأكيد الحذف؟')) return
  try {
    await $fetch('/api/products', { method: 'DELETE', body: { id } })
    await fetchProducts()
    showSuccessMessage('تم حذف السلعة بنجاح!')
  } catch (err) {
    alert('حدث خطأ')
  }
}

function startEdit(product) {
  newItem.value = { ...product }
  isEditing.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function updateProduct() {
  try {
    await $fetch('/api/products', { method: 'PUT', body: newItem.value })
    cancelEdit()
    await fetchProducts()
    showSuccessMessage('تم تحديث السلعة بنجاح!')
  } catch (err) {
    alert('حدث خطأ')
  }
}

function cancelEdit() {
  isEditing.value = false
  newItem.value = { id: null, name: '', price: '', wholesalePrice: '' }
}

onMounted(() => {
  checkSession()
})
</script>

<style>
/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #1a202c;
}

.app-container {
  min-height: 100vh;
  padding: 0;
}

/* Login Screen */
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.logo-icon {
  font-size: 2.5rem;
}

.login-header h1 {
  font-size: 1.8rem;
  color: #1a202c;
  margin-bottom: 8px;
  font-weight: 700;
}

.subtitle {
  color: #718096;
  font-size: 0.95rem;
}

.login-form {
  text-align: right;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  z-index: 2;
}

.auth-input {
  width: 100%;
  padding: 14px 45px 14px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;
  background: #f7fafc;
}

.auth-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-arrow {
  font-size: 1.3rem;
  font-weight: bold;
}

.error-message {
  color: #e53e3e;
  margin-top: 16px;
  font-size: 0.9rem;
  text-align: center;
  background: #fff5f5;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
}

/* Main App */
.main-app {
  min-height: 100vh;
  background: #f7fafc;
}

/* Success Toast */
.success-toast {
  position: fixed;
  top: 16px;
  left: 16px;
  right: 16px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(72, 187, 120, 0.4);
  z-index: 1000;
  animation: slideDown 0.3s ease;
  font-weight: 600;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.toast-icon {
  width: 24px;
  height: 24px;
  background: white;
  color: #48bb78;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.toast-text {
  flex: 1;
  font-size: 0.95rem;
}

/* App Header */
.app-header {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.brand-text h2 {
  font-size: 1.3rem;
  color: #1a202c;
  margin-bottom: 2px;
  font-weight: 700;
}

.brand-text p {
  font-size: 0.8rem;
  color: #718096;
}

.logout-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(252, 129, 129, 0.3);
  transition: all 0.3s;
}

.logout-btn:active {
  transform: scale(0.95);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 12px;
  border-radius: 12px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 700;
  color: #1a202c;
  font-size: 1rem;
}

.user-role {
  font-size: 0.85rem;
  color: #718096;
}

/* Dashboard */
.dashboard {
  padding: 20px;
  padding-bottom: 80px;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-icon {
  font-size: 2.2rem;
  opacity: 0.9;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Tab Navigation */
.tab-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: white;
  padding: 6px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  color: #718096;
  transition: all 0.3s;
}

.tab-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.tab-icon {
  font-size: 1.2rem;
}

/* Content Section */
.content-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  text-align: center;
  margin-bottom: 20px;
}

.section-title h3 {
  font-size: 1.3rem;
  color: #1a202c;
  font-weight: 700;
}

/* Search Box */
.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  z-index: 2;
  color: #a0aec0;
}

.search-input {
  width: 100%;
  padding: 14px 45px 14px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s;
  font-weight: 500;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Form Card */
.form-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-input, .form-select {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  background: #f7fafc;
  transition: all 0.3s;
  font-weight: 500;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  margin-top: 8px;
}

.submit-btn.add {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.submit-btn.update {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(237, 137, 54, 0.3);
}

.submit-btn.cancel {
  background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(160, 174, 192, 0.3);
}

.submit-btn:active {
  transform: scale(0.98);
}

.edit-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Products/Users List */
.products-list, .users-list {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f7fafc;
}

.list-header h4 {
  font-size: 1.1rem;
  color: #1a202c;
  font-weight: 700;
}

.count-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

/* Product Item */
.product-item {
  background: #f7fafc;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.product-info {
  flex: 1;
}

.product-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.product-icon {
  font-size: 1.3rem;
}

.product-header h5 {
  font-size: 1.05rem;
  color: #1a202c;
  font-weight: 700;
}

.product-prices {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.price-tag {
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  border: 2px solid;
}

.price-tag.retail {
  border-color: #667eea;
}

.price-tag.wholesale {
  border-color: #48bb78;
}

.price-label {
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 2px;
}

.price-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a202c;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.edit {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);
}

.action-btn.delete {
  background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
  box-shadow: 0 2px 8px rgba(252, 129, 129, 0.3);
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* User Item */
.user-item {
  background: #f7fafc;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-small {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
}

.user-info-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 700;
  color: #1a202c;
  font-size: 1rem;
  margin-bottom: 4px;
}

.role-tag {
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 12px;
}

.role-tag.admin {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #744210;
}

.role-tag.employee {
  background: linear-gradient(135deg, #90cdf4 0%, #63b3ed 100%);
  color: #2c5282;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a0aec0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1rem;
  font-weight: 600;
  color: #718096;
}

.empty-hint {
  display: block;
  margin-top: 8px;
  font-size: 0.9rem;
  color: #a0aec0;
}

/* Loading */
.loading {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  color: #718096;
  font-weight: 600;
}

/* Employee View */
.employee-view {
  padding: 20px;
  padding-bottom: 80px;
}

.search-section {
  background: white;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-section h3 {
  text-align: center;
  font-size: 1.3rem;
  color: #1a202c;
  margin-bottom: 16px;
  font-weight: 700;
}

.results-section {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f7fafc;
}

.results-header h4 {
  font-size: 1.1rem;
  color: #1a202c;
  font-weight: 700;
}

.product-card {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 16px;
  text-align: center;
  border: 2px solid #e2e8f0;
  transition: all 0.3s;
}

.product-card:active {
  transform: scale(0.98);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  opacity: 0.8;
}

.card-title {
  font-size: 1.2rem;
  color: #1a202c;
  font-weight: 700;
  margin-bottom: 16px;
}

.card-prices {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.price-box {
  background: white;
  padding: 14px;
  border-radius: 12px;
  border: 2px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.price-box.retail {
  border-color: #667eea;
}

.price-box.wholesale {
  border-color: #48bb78;
}

.box-label {
  display: block;
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 6px;
  font-weight: 600;
}

.box-value {
  display: block;
  font-size: 1.15rem;
  font-weight: 800;
  color: #1a202c;
}
</style>