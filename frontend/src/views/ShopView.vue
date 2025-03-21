<template>
  <div class="shop-view">
    <!-- Header with cart icon -->
    <div class="shop-header">
      <h1>Магазин Хакатона</h1>
      <div class="cart-icon" @click="showCart = true">
        <i class="fas fa-shopping-bag"></i>
        <span class="cart-count" v-if="cart.length > 0">{{ cart.length }}</span>
      </div>
    </div>

    <!-- Main shop content -->
    <div class="shop-content" v-if="!selectedProduct && !showCart">
      <!-- Featured product banner with horizontal scroll -->
      <div class="banner-container">
        <div class="banner-scroll" ref="bannerScroll">
          <div 
            v-for="(banner, index) in banners" 
            :key="index" 
            class="featured-banner"
            @click="viewBannerProduct(banner)"
          >
            <div class="discount-tag">{{ banner.discount }}</div>
            <div class="featured-info">
              <h2>{{ banner.name }}</h2>
              <img :src="banner.image" :alt="banner.name" class="featured-image">
            </div>
          </div>
        </div>
      </div>

      <!-- Banner pagination dots -->
      <div class="banner-pagination">
        <span 
          v-for="(banner, index) in banners" 
          :key="index" 
          :class="['dot', currentBannerIndex === index ? 'active' : '']"
          @click="scrollToBanner(index)"
        ></span>
      </div>

      <!-- Category filters -->
      <div class="category-filters">
        <button 
          v-for="category in categories" 
          :key="category.id" 
          :class="['category-btn', activeCategory === category.id ? 'active' : '']"
          @click="setActiveCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Products grid -->
      <div class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="product-card"
        >
          <div class="product-image" @click="viewProductDetails(product)">
            <img :src="product.images[0]" :alt="product.name">
          </div>
          <div class="product-info">
            <h3 @click="viewProductDetails(product)">{{ product.name }}</h3>
            <div class="product-price">{{ product.price }} 💎</div>
            <button class="add-btn" @click="quickAddToCart(product)">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom navigation -->
      <div class="bottom-nav">
        <div class="nav-item active">
          <i class="fas fa-home"></i>
        </div>
        <div class="nav-item">
          <i class="fas fa-columns"></i>
        </div>
        <div class="nav-item">
          <i class="fas fa-shopping-bag"></i>
        </div>
        <div class="nav-item">
          <i class="far fa-user"></i>
        </div>
        <div class="nav-item">
          <i class="fas fa-search"></i>
        </div>
      </div>
    </div>

    <!-- Product Detail View -->
    <div class="product-detail" v-if="selectedProduct && !showCart">
      <div class="detail-header">
        <button class="back-btn" @click="selectedProduct = null">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2>{{ getCategoryName(activeCategory) }}</h2>
      </div>

      <div class="detail-content">
        <!-- Image slider with horizontal scroll -->
        <div class="detail-image-slider">
          <div class="image-scroll" ref="imageScroll">
            <img 
              v-for="(image, index) in selectedProduct.images" 
              :key="index" 
              :src="image" 
              :alt="selectedProduct.name"
            >
          </div>
          <!-- Image pagination dots -->
          <div class="image-pagination">
            <span 
              v-for="(image, index) in selectedProduct.images" 
              :key="index" 
              :class="['dot', currentImageIndex === index ? 'active' : '']"
              @click="scrollToImage(index)"
            ></span>
          </div>
        </div>

        <div class="detail-info">
          <div class="detail-header-info">
            <h2>{{ selectedProduct.name }}</h2>
            <button class="favorite-btn">
              <i class="far fa-heart"></i>
            </button>
          </div>
          <div class="detail-price">{{ selectedProduct.price }} 💎</div>

          <!-- Size selection -->
          <div class="size-selection">
            <button 
              v-for="size in sizes" 
              :key="size"
              :class="['size-btn', selectedSize === size ? 'selected' : '']"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>

          <!-- Product description -->
          <div class="product-description">
            <h3>Описание</h3>
            <ul>
              <li v-for="(line, index) in selectedProduct.description" :key="index">
                {{ line }}
              </li>
            </ul>
          </div>

          <!-- Quantity and add to cart -->
          <div class="quantity-control">
            <button class="quantity-btn" @click="decreaseQuantity">
              <i class="fas fa-minus"></i>
            </button>
            <span class="quantity">{{ quantity }} items</span>
            <button class="quantity-btn" @click="increaseQuantity">
              <i class="fas fa-plus"></i>
            </button>
          </div>

          <!-- Кнопка для десктопной версии -->
          <button class="add-to-bag-btn desktop-only" @click="addToCart(selectedProduct)">
            Добавить в корзину
          </button>
        </div>
      </div>
      
      <!-- Mobile-specific Add to Bag button that appears above bottom navigation -->
      <div class="mobile-button-container">
        <button class="add-to-bag-btn" @click="addToCart(selectedProduct)">
          Добавить в корзину
        </button>
      </div>
    </div>

    <!-- Quick Add Modal -->
    <div class="quick-add-modal" v-if="quickAddProduct && !showCart">
      <div class="modal-overlay" @click="quickAddProduct = null"></div>
      <div class="modal-content">
        <div class="product-preview">
          <img :src="quickAddProduct.images[0]" :alt="quickAddProduct.name">
          <div class="product-preview-info">
            <h3>{{ quickAddProduct.name }}</h3>
            <div class="product-price">{{ quickAddProduct.price }} 💎</div>
          </div>
        </div>

        <!-- Size selection -->
        <div class="size-selection">
          <button 
            v-for="size in sizes" 
            :key="size"
            :class="['size-btn', selectedSize === size ? 'selected' : '']"
            @click="selectedSize = size"
          >
            {{ size }}
          </button>
        </div>

        <!-- Quantity control -->
        <div class="quantity-control">
          <button class="quantity-btn" @click="decreaseQuantity">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity">{{ quantity }} items</span>
          <button class="quantity-btn" @click="increaseQuantity">
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <button class="add-to-bag-btn" @click="addToCart(quickAddProduct)">
          Добавить в корзину
        </button>
      </div>
    </div>

    <!-- Shopping Cart -->
    <div class="shopping-cart" v-if="showCart">
      <div class="cart-header">
        <button class="back-btn" @click="showCart = false">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2>{{ getCategoryName(activeCategory) }}</h2>
      </div>

      <div class="cart-content">
        <div v-if="cart.length === 0" class="empty-cart">
          <i class="fas fa-shopping-bag"></i>
          <p>Ваша корзина пуста</p>
        </div>

        <div v-else class="cart-items">
          <div v-for="(item, index) in cart" :key="index" class="cart-item">
            <div class="cart-item-image">
              <img :src="item.product.images[0]" :alt="item.product.name">
            </div>
            <div class="cart-item-info">
              <h3>{{ item.product.name }}</h3>
              <p>{{ item.product.price }} 💎</p>
              <div class="item-size">Размер: {{ item.size }}</div>
            </div>
            <div class="cart-item-quantity">
              <button class="quantity-btn" @click="updateCartItemQuantity(index, -1)">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button class="quantity-btn" @click="updateCartItemQuantity(index, 1)">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary" v-if="cart.length > 0">
          <div class="summary-row">
            <span>Итого</span>
            <span>{{ calculateSubtotal() }} 💎</span>
          </div>
          <div class="summary-row">
            <span>Доставка</span>
            <span>50 💎</span>
          </div>
          <div class="summary-row total">
            <span>Всего</span>
            <span>{{ calculateTotal() }} 💎</span>
          </div>

          <button class="checkout-btn">
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue';

// Простая реализация debounce
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// State variables
const selectedProduct = ref(null);
const quickAddProduct = ref(null);
const showCart = ref(false);
const selectedSize = ref('M');
const quantity = ref(2);
const cart = ref([]);
const activeCategory = ref('top-deals');
const currentBannerIndex = ref(0);
const currentImageIndex = ref(0);

// Refs for scroll containers
const bannerScroll = ref(null);
const imageScroll = ref(null);

// Categories
const categories = [
  { id: 'top-deals', name: 'Лучшие предложения' },
  { id: 'apparels', name: 'Одежда' },
  { id: 'accessories', name: 'Аксессуары' },
  { id: 'gadgets', name: 'Гаджеты' }
];

// Sizes
const sizes = ['XS', 'S', 'M', 'L', 'XL', '3XL', '4XL'];

// Banners
const banners = reactive([
  {
    id: 1,
    name: 'Premium Hacker Kit',
    discount: '20% Скидка',
    image: 'https://via.placeholder.com/150/000000/FFFFFF?text=Hacker+Kit'
  },
  {
    id: 2,
    name: 'CodeMaster Backpack',
    discount: 'Купи 1, Получи 1',
    image: 'https://via.placeholder.com/150/000000/FFFFFF?text=Backpack'
  },
  {
    id: 3,
    name: 'TechWizard Sticker Pack',
    discount: '10% Скидка',
    image: 'https://via.placeholder.com/150/FF69B4/FFFFFF?text=Sticker'
  }
]);

// Products data with multiple images
const products = reactive([
  {
    id: 1,
    name: 'Hacker Hoodie',
    price: 500,
    images: [
      'https://via.placeholder.com/150/FFFFFF/000000?text=Hoodie+Front',
      'https://via.placeholder.com/150/FFFFFF/000000?text=Hoodie+Back',
      'https://via.placeholder.com/150/FFFFFF/000000?text=Hoodie+Side'
    ],
    category: ['top-deals', 'apparels'],
    description: [
      'Удобный худи для долгих кодинг-сессий',
      'Материал: 80% хлопок, 20% полиэстер',
      'Принт с логотипом хакатона',
      'Мягкая подкладка',
      'Идеально для командных встреч'
    ]
  },
  {
    id: 2,
    name: 'CodeMaster Backpack',
    price: 800,
    images: [
      'https://via.placeholder.com/150/000000/FFFFFF?text=Backpack+Front',
      'https://via.placeholder.com/150/000000/FFFFFF?text=Backpack+Side',
      'https://via.placeholder.com/150/000000/FFFFFF?text=Backpack+Back'
    ],
    category: ['top-deals', 'accessories'],
    description: [
      'Прочный рюкзак для ноутбука',
      'Отделение для гаджетов',
      'Водоотталкивающий материал',
      'Эргономичные лямки',
      'Стильный дизайн с логотипом хакатона'
    ]
  },
  {
    id: 3,
    name: 'TechWizard Sticker Pack',
    price: 150,
    images: [
      'https://via.placeholder.com/150/FF69B4/FFFFFF?text=Sticker+1',
      'https://via.placeholder.com/150/FF69B4/FFFFFF?text=Sticker+2',
      'https://via.placeholder.com/150/FF69B4/FFFFFF?text=Sticker+3'
    ],
    category: ['accessories'],
    description: [
      'Набор стикеров для ноутбука',
      'Технологические мемы и логотипы',
      'Водостойкие наклейки',
      '5 уникальных дизайнов',
      'Идеально для кастомизации'
    ]
  },
  {
    id: 4,
    name: 'Hacker Flashlight',
    price: 200,
    images: [
      'https://via.placeholder.com/150/FF0000/FFFFFF?text=Flashlight+1',
      'https://via.placeholder.com/150/FF0000/FFFFFF?text=Flashlight+2',
      'https://via.placeholder.com/150/FF0000/FFFFFF?text=Flashlight+3'
    ],
    category: ['accessories', 'gadgets'],
    description: [
      'Компактный фонарик для хакатона',
      '3 режима яркости',
      'Питание от USB-C',
      'Прочный корпус',
      'Идеально для ночных кодинг-сессий'
    ]
  },
  {
    id: 5,
    name: 'Hacker Starter Kit',
    price: 1200,
    images: [
      'https://via.placeholder.com/150/FF0000/FFFFFF?text=Kit+1',
      'https://via.placeholder.com/150/FF0000/FFFFFF?text=Kit+2',
      'https://via.placeholder.com/150/FF0000/FFFFFF?text=Kit+3'
    ],
    category: ['top-deals'],
    description: [
      'Набор для начинающих хакеров',
      'Включает футболку, стикеры и кружку',
      'Эксклюзивный дизайн',
      'Ограниченная серия',
      'Идеальный подарок для участников'
    ]
  },
  {
    id: 6,
    name: 'CodeNinja T-Shirt',
    price: 350,
    images: [
      'https://via.placeholder.com/150/0000FF/FFFFFF?text=T-Shirt+Front',
      'https://via.placeholder.com/150/0000FF/FFFFFF?text=T-Shirt+Back',
      'https://via.placeholder.com/150/0000FF/FFFFFF?text=T-Shirt+Side'
    ],
    category: ['apparels'],
    description: [
      'Футболка с принтом "CodeNinja"',
      '100% хлопок',
      'Свободный крой',
      'Дышащий материал',
      'Машинная стирка'
    ]
  },
  {
    id: 7,
    name: 'TeamCode Socks',
    price: 180,
    images: [
      'https://via.placeholder.com/150/FFA500/FFFFFF?text=Socks+1',
      'https://via.placeholder.com/150/FFA500/FFFFFF?text=Socks+2',
      'https://via.placeholder.com/150/FFA500/FFFFFF?text=Socks+3'
    ],
    category: ['apparels', 'accessories'],
    description: [
      'Носки с логотипом хакатона',
      'Материал: хлопок и эластан',
      'Удобная посадка',
      'Дышащая ткань',
      'Универсальный размер'
    ]
  },
  {
    id: 8,
    name: 'Hackathon Poster',
    price: 250,
    images: [
      'https://via.placeholder.com/150/800080/FFFFFF?text=Poster+1',
      'https://via.placeholder.com/150/800080/FFFFFF?text=Poster+2',
      'https://via.placeholder.com/150/800080/FFFFFF?text=Poster+3'
    ],
    category: ['accessories'],
    description: [
      'Постер с символикой хакатона',
      'Размер: 18" x 24"',
      'Матовое покрытие',
      'Готов к обрамлению',
      'Эксклюзивный дизайн'
    ]
  },
  {
    id: 9,
    name: 'CodeBrew Mug',
    price: 220,
    images: [
      'https://via.placeholder.com/150/008000/FFFFFF?text=Mug+1',
      'https://via.placeholder.com/150/008000/FFFFFF?text=Mug+2',
      'https://via.placeholder.com/150/008000/FFFFFF?text=Mug+3'
    ],
    category: ['top-deals', 'accessories'],
    description: [
      'Кружка для кофейных перерывов',
      'Объем: 11 унций',
      'Материал: керамика',
      'Можно использовать в микроволновке',
      'Принт с логотипом хакатона'
    ]
  },
  {
    id: 10,
    name: 'Premium Hacker Kit',
    price: 1500,
    images: [
      'https://via.placeholder.com/150/000000/FFFFFF?text=Hacker+Kit+1',
      'https://via.placeholder.com/150/000000/FFFFFF?text=Hacker+Kit+2',
      'https://via.placeholder.com/150/000000/FFFFFF?text=Hacker+Kit+3'
    ],
    category: ['top-deals'],
    description: [
      'Премиум-набор для хакеров',
      'Включает худи, рюкзак и стикеры',
      'Эксклюзивный дизайн',
      'Ограниченная серия',
      'Идеально для участников хакатона'
    ]
  }
]);

// Computed properties
const filteredProducts = computed(() => {
  if (activeCategory.value === 'top-deals') {
    return products.filter(product => product.category.includes('top-deals'));
  }
  return products.filter(product => product.category.includes(activeCategory.value));
});

// Methods
const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId;
};

const getCategoryName = (categoryId) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : '';
};

const viewProductDetails = (product) => {
  selectedProduct.value = product;
  selectedSize.value = 'M';
  quantity.value = 2;
  currentImageIndex.value = 0;
  setupImageScrollListener();
};

const viewBannerProduct = (banner) => {
  const product = products.find(p => p.name === banner.name);
  if (product) {
    viewProductDetails(product);
  }
};

const quickAddToCart = (product) => {
  quickAddProduct.value = product;
  selectedSize.value = 'M';
  quantity.value = 2;
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = (product) => {
  cart.value.push({
    product,
    size: selectedSize.value,
    quantity: quantity.value
  });
  
  if (quickAddProduct.value) {
    quickAddProduct.value = null;
  } else if (selectedProduct.value) {
    selectedProduct.value = null;
  }
  
  alert(`Добавлено ${quantity.value} ${product.name} (Размер: ${selectedSize.value}) в вашу корзину!`);
};

const updateCartItemQuantity = (index, change) => {
  const newQuantity = cart.value[index].quantity + change;
  
  if (newQuantity <= 0) {
    cart.value.splice(index, 1);
  } else {
    cart.value[index].quantity = newQuantity;
  }
};

const calculateSubtotal = () => {
  return cart.value.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

const calculateTotal = () => {
  return calculateSubtotal() + 50;
};

// Прокрутка баннеров
const scrollToBanner = (index) => {
  currentBannerIndex.value = index;
  const bannerScrollElement = bannerScroll.value;
  if (bannerScrollElement) {
    const bannerWidth = bannerScrollElement.querySelector('.featured-banner')?.offsetWidth || 0;
    if (bannerWidth > 0) {
      bannerScrollElement.scrollTo({
        left: index * bannerWidth,
        behavior: 'smooth'
      });
      setTimeout(() => {
        const scrollPosition = bannerScrollElement.scrollLeft;
        const newIndex = Math.round(scrollPosition / bannerWidth);
        currentBannerIndex.value = newIndex;
      }, 500);
    }
  }
};

// Прокрутка изображений в детальном представлении
const scrollToImage = (index) => {
  currentImageIndex.value = index;
  const imageScrollElement = imageScroll.value;
  if (imageScrollElement) {
    const imageElement = imageScrollElement.querySelector('img');
    if (imageElement && imageElement.offsetWidth > 0) {
      const imageWidth = imageElement.offsetWidth;
      imageScrollElement.scrollTo({
        left: index * imageWidth,
        behavior: 'smooth'
      });
      setTimeout(() => {
        const scrollPosition = imageScrollElement.scrollLeft;
        const newIndex = Math.round(scrollPosition / imageWidth);
        currentImageIndex.value = newIndex;
      }, 500);
    } else {
      setTimeout(() => scrollToImage(index), 100);
    }
  }
};

// Обработчик скролла для баннеров с debounce
const handleBannerScroll = debounce(() => {
  const bannerScrollElement = bannerScroll.value;
  if (bannerScrollElement) {
    const bannerWidth = bannerScrollElement.querySelector('.featured-banner')?.offsetWidth || 0;
    if (bannerWidth > 0) {
      const scrollPosition = bannerScrollElement.scrollLeft;
      const newIndex = Math.round(scrollPosition / bannerWidth);
      currentBannerIndex.value = newIndex;
    }
  }
}, 100);

// Обработчик скролла для изображений с debounce
const handleImageScroll = debounce(() => {
  const imageScrollElement = imageScroll.value;
  if (imageScrollElement) {
    const imageWidth = imageScrollElement.querySelector('img')?.offsetWidth || 0;
    if (imageWidth > 0) {
      const scrollPosition = imageScrollElement.scrollLeft;
      const newIndex = Math.round(scrollPosition / imageWidth);
      currentImageIndex.value = newIndex;
    }
  }
}, 100);

// Установка слушателей событий
const setupBannerScrollListener = async () => {
  await nextTick(); // Ждем, пока DOM обновится
  const bannerScrollElement = bannerScroll.value;
  if (bannerScrollElement) {
    bannerScrollElement.removeEventListener('scroll', handleBannerScroll);
    bannerScrollElement.addEventListener('scroll', handleBannerScroll);
    // Синхронизируем currentBannerIndex с текущей позицией скролла
    const bannerWidth = bannerScrollElement.querySelector('.featured-banner')?.offsetWidth || 0;
    if (bannerWidth > 0) {
      const scrollPosition = bannerScrollElement.scrollLeft;
      const newIndex = Math.round(scrollPosition / bannerWidth);
      currentBannerIndex.value = newIndex;
    }
  }
};

const setupImageScrollListener = async () => {
  await nextTick();
  const imageScrollElement = imageScroll.value;
  if (imageScrollElement) {
    imageScrollElement.removeEventListener('scroll', handleImageScroll);
    imageScrollElement.addEventListener('scroll', handleImageScroll);
  }
};

// Удаление слушателей событий
const removeBannerScrollListener = () => {
  const bannerScrollElement = bannerScroll.value;
  if (bannerScrollElement) {
    bannerScrollElement.removeEventListener('scroll', handleBannerScroll);
  }
};

const removeImageScrollListener = () => {
  const imageScrollElement = imageScroll.value;
  if (imageScrollElement) {
    imageScrollElement.removeEventListener('scroll', handleImageScroll);
  }
};

// Устанавливаем слушатели при монтировании компонента
onMounted(() => {
  setupBannerScrollListener();
});

// Удаляем слушатели при размонтировании компонента
onUnmounted(() => {
  removeBannerScrollListener();
  removeImageScrollListener();
});

// Следим за изменениями selectedProduct и showCart для управления слушателем баннера
watch([selectedProduct, showCart], async ([newSelectedProduct, newShowCart]) => {
  if (!newSelectedProduct && !newShowCart) {
    // Возвращаемся на главную страницу, баннеры видны
    await nextTick(); // Ждем, пока DOM обновится
    setupBannerScrollListener();
  } else {
    // Скрываем баннеры, удаляем слушатель
    removeBannerScrollListener();
  }
});

// Следим за изменением selectedProduct для повторной установки слушателя изображений
watch(selectedProduct, async () => {
  if (selectedProduct.value) {
    currentImageIndex.value = 0;
    await setupImageScrollListener();
  } else {
    removeImageScrollListener();
  }
});
</script>

<style scoped>
/* General Styles */
.shop-view {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #fff;
  color: #333;
  height: 100vh;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Header Styles */
.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 10;
  border-bottom: 1px solid #eee;
}

.shop-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.cart-icon {
  position: relative;
  font-size: 1.2rem;
  color: #333;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #4ECDC4;
  color: #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

/* Banner Container with Horizontal Scroll */
.banner-container {
  padding: 0 20px;
  margin-bottom: 15px;
}

.banner-scroll {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  gap: 15px;
}

.banner-scroll::-webkit-scrollbar {
  display: none;
}

.featured-banner {
  background-color: #4ECDC4;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 0 90%;
  scroll-snap-align: start;
  height: 150px;
  cursor: pointer;
}

.discount-tag {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
  color: #fff;
}

.featured-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.featured-info h2 {
  margin: 0;
  font-size: 1rem;
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #fff;
}

.featured-image {
  width: 100px;
  height: auto;
  position: absolute;
  right: 20px;
  bottom: 10px;
}

/* Banner Pagination */
.banner-pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 10px 0 20px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ddd;
  cursor: pointer;
}

.dot.active {
  background-color: #4ECDC4;
}

/* Category Filters */
.category-filters {
  display: flex;
  gap: 10px;
  padding: 0 20px;
  margin-bottom: 20px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-filters::-webkit-scrollbar {
  display: none;
}

.category-btn {
  background-color: #f5f5f5;
  border: none;
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  white-space: nowrap;
}

.category-btn.active {
  background-color: #4ECDC4;
  color: #fff;
  font-weight: 500;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 0 20px;
  margin-bottom: 100px;
}

.product-card {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.product-image {
  height: 150px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 10px;
  position: relative;
  min-height: 80px;
}

.product-info h3 {
  margin: 0 0 5px;
  font-size: 0.9rem;
  font-weight: 500;
  padding-right: 30px;
}

.product-price {
  font-weight: 600;
  font-size: 1rem;
}

.add-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #4ECDC4;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 15px 0;
  border-top: 1px solid #eee;
  z-index: 30;
}

.nav-item {
  font-size: 1.2rem;
  color: #999;
}

.nav-item.active {
  color: #4ECDC4;
}

/* Product Detail View */
.product-detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 20;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 10;
  border-bottom: 1px solid #eee;
}

.back-btn {
  background: none;
  border: none;
  color: #333;
  font-size: 1.2rem;
  margin-right: 15px;
  padding: 0;
}

.detail-content {
  padding: 20px;
  padding-bottom: 120px;
}

.detail-image-slider {
  margin-bottom: 20px;
  position: relative;
}

.image-scroll {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  gap: 10px;
}

.image-scroll::-webkit-scrollbar {
  display: none;
}

.image-scroll img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: #f9f9f9;
  flex: 0 0 100%;
  scroll-snap-align: start;
}

.image-pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 10px;
}

.detail-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.detail-header-info h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.favorite-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 1.2rem;
  padding: 0;
}

.detail-price {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.size-selection {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  scrollbar-width: none;
}

.size-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  color: #333;
  border: none;
  font-size: 0.8rem;
  font-weight: 500;
}

.size-btn.selected {
  background-color: #4ECDC4;
  color: #fff;
}

/* Product Description */
.product-description {
  margin-bottom: 20px;
}

.product-description h3 {
  font-size: 1rem;
  margin-bottom: 10px;
}

.product-description ul {
  padding-left: 20px;
  margin: 0;
}

.product-description li {
  margin-bottom: 5px;
  font-size: 0.9rem;
}

/* Quantity Control */
.quantity-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 20px;
}

.quantity-btn {
  background: none;
  border: none;
  color: #333;
  font-size: 0.9rem;
  padding: 5px;
}

.quantity {
  font-size: 0.9rem;
}

.add-to-bag-btn {
  width: 100%;
  background-color: #4ECDC4;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;
}

.desktop-only {
  display: block;
}

/* Mobile-specific Add to Bag button */
.mobile-button-container {
  display: none;
}

.mobile-button-container .add-to-bag-btn {
  width: 100%;
  margin: 0;
  border-radius: 0;
  background-color: #4ECDC4;
  color: #fff;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;
}

/* Quick Add Modal */
.quick-add-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background-color: #fff;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.product-preview {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.product-preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-preview-info h3 {
  margin: 0 0 5px;
  font-size: 1rem;
}

/* Обновляем стили для кнопки Add to Bag */
.quick-add-modal .add-to-bag-btn {
  width: 100%;
  background-color: #4ECDC4;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 20px;
}

/* Shopping Cart */
.shopping-cart {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 20;
  overflow-y: auto;
}

.cart-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 10;
  border-bottom: 1px solid #eee;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
}

.empty-cart i {
  font-size: 3rem;
  margin-bottom: 10px;
}

.cart-items {
  padding: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 8px;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;
}

.cart-item-info h3 {
  margin: 0 0 5px;
  font-size: 1rem;
}

.cart-item-info p {
  margin: 0 0 5px;
  font-weight: 600;
}

.item-size {
  font-size: 0.8rem;
  color: #999;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-summary {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  margin: 0 20px 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-row.total {
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.checkout-btn {
  width: 100%;
  background-color: #4ECDC4;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 20px;
}

/* Media queries for mobile devices */
@media (max-width: 768px) {
  .detail-content {
    padding-bottom: 120px;
  }
  
  .desktop-only {
    display: none;
  }
  
  .mobile-button-container {
    display: block;
    position: fixed;
    bottom: 70px;
    left: 0;
    right: 0;
    padding: 0;
    z-index: 40;
  }
  
  .mobile-button-container .add-to-bag-btn {
    display: block;
    width: 100%;
    margin: 0;
    border-radius: 0;
    background-color: #4ECDC4;
    color: #fff;
    padding: 15px;
    font-size: 1rem;
    font-weight: 600;
  }

  .modal-content {
    padding-bottom: 80px;
  }

  .quick-add-modal .add-to-bag-btn {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    border-radius: 0;
    z-index: 100;
  }
}
</style>