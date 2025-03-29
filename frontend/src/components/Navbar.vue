<template>
    <nav class="navbar">
        <div class="nav-content">
            <RouterLink to="/" class="nav-item" active-class="active">
                <div class="nav-icon">
                    <svg width="35" height="33" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.7399 4.11189C17.2067 3.84291 17.7939 3.84291 18.2608 4.11189L28.4691 9.99384C28.9026 10.2436 29.167 10.6881 29.167 11.1671V26.1248C29.167 26.8842 28.5141 27.4998 27.7087 27.4998H23.3337V19.2498C23.3337 16.9716 21.3749 15.1248 18.9587 15.1248H16.042C13.6257 15.1248 11.667 16.9716 11.667 19.2498V27.4998H7.29199C6.48658 27.4998 5.83366 26.8842 5.83366 26.1248V11.1671C5.83366 10.6881 6.09805 10.2436 6.53154 9.99384L16.7399 4.11189ZM14.5837 27.4998V19.2498C14.5837 18.4904 15.2366 17.8748 16.042 17.8748H18.9587C19.7641 17.8748 20.417 18.4904 20.417 19.2498V27.4998H14.5837ZM21.8753 30.2498H27.7087C30.1249 30.2498 32.0837 28.403 32.0837 26.1248V11.1671C32.0837 9.73009 31.2905 8.39664 29.99 7.64731L19.7817 1.76537C18.3812 0.958419 16.6195 0.958418 15.219 1.76537L5.01065 7.64731C3.71016 8.39664 2.91699 9.73009 2.91699 11.1671V26.1248C2.91699 28.403 4.87575 30.2498 7.29199 30.2498H13.1253H21.8753Z" fill="#125BE4"/>
                    </svg>
                </div>
                <span>Главная</span>
            </RouterLink>

            <RouterLink to="/hackathons" class="nav-item" active-class="active">
                <div class="nav-icon">
                    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.7 23.7777L7.31565 22.2387C7.57264 22.1528 7.83456 22.0825 8.1 22.0281V3.2223L2.7 5.02323V23.7777ZM1.8063 26.9205C1.60252 26.9937 1.38413 27.0168 1.16955 26.9879C0.954969 26.9589 0.750499 26.8788 0.573391 26.7542C0.396283 26.6297 0.251733 26.4644 0.151938 26.2722C0.0521434 26.08 3.16608e-05 25.8667 2.55711e-08 25.6502V4.04986C-5.61619e-05 3.76109 0.0924847 3.4799 0.264032 3.24761C0.435579 3.01531 0.677091 2.84414 0.9531 2.75924L7.31565 0.638362C8.70109 0.176589 10.1989 0.176589 11.5844 0.638362L16.2689 2.20034C17.1004 2.47764 17.9996 2.47764 18.8312 2.20034L25.1937 0.0794542C25.3975 0.00626849 25.6159 -0.0168275 25.8305 0.0121151C26.045 0.0410577 26.2495 0.12119 26.4266 0.245749C26.6037 0.370309 26.7483 0.535643 26.8481 0.727799C26.9479 0.919955 27 1.1333 27 1.34982V22.9501C27.0001 23.2389 26.9075 23.5201 26.736 23.7524C26.5644 23.9847 26.3229 24.1559 26.0469 24.2408L19.6844 26.3616C18.2989 26.8234 16.8011 26.8234 15.4156 26.3616L10.7311 24.7997C9.89956 24.5224 9.00044 24.5224 8.16885 24.7997L1.8063 26.9205ZM24.3 21.9781V3.2223L19.6844 4.76132C19.4274 4.8472 19.1654 4.91753 18.9 4.97193V23.7777L24.3 21.9768V21.9781ZM16.2 23.779V4.97193C15.9346 4.91753 15.6726 4.8472 15.4156 4.76132L10.8 3.2223V22.0281C11.0654 22.0825 11.3274 22.1528 11.5844 22.2387L16.2 23.7777V23.779Z" fill="#656565"/>
                    </svg>
                </div>
                <span>Хакатоны</span>
            </RouterLink>

            <RouterLink to="/rating" class="nav-item" active-class="active">
                <div class="nav-icon">
                    <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 7H1V23H6V7Z" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 1H11V23H16V1Z" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M25 10H21V23H25V10Z" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <span>Рейтинг</span>
            </RouterLink>

            <RouterLink to="/shop" class="nav-item" active-class="active">
                <div class="nav-icon">
                    <svg width="25" height="27" viewBox="0 0 25 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 0C8.96459 0 6.09857 3.15347 6.09857 7.04348H4.76604C3.16183 7.04348 1.80542 8.35015 1.5934 10.0998L0.0286076 23.0128C-0.22723 25.124 1.26549 27 3.20125 27H21.7988C23.7345 27 25.2272 25.124 24.9714 23.0128L23.4066 10.0998C23.1946 8.35015 21.8382 7.04348 20.234 7.04348H18.9014C18.9014 3.15347 16.0354 0 12.5 0ZM16.7676 7.04348H8.23238C8.23238 4.45014 10.1431 2.34783 12.5 2.34783C14.8569 2.34783 16.7676 4.45014 16.7676 7.04348ZM4.76604 9.3913H20.234C20.7687 9.3913 21.2208 9.82686 21.2915 10.4101L22.8563 23.3231C22.9416 24.0269 22.444 24.6522 21.7988 24.6522H3.20125C2.55599 24.6522 2.05842 24.0269 2.1437 23.3231L3.70849 10.4101C3.77917 9.82686 4.2313 9.3913 4.76604 9.3913Z" fill="#656565"/>
                    </svg>
                </div>
                <span>Магазин</span>
            </RouterLink>

            <RouterLink to="/profile" class="nav-item" active-class="active">
                <div class="nav-icon">
                    <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.8747 6.99984C10.8747 5.06684 12.4976 3.49984 14.4997 3.49984C16.5017 3.49984 18.1247 5.06684 18.1247 6.99984C18.1247 8.93283 16.5017 10.4998 14.4997 10.4998C12.4976 10.4998 10.8747 8.93283 10.8747 6.99984ZM14.4997 1.1665C11.163 1.1665 8.45801 3.77818 8.45801 6.99984C8.45801 10.2215 11.163 12.8332 14.4997 12.8332C17.8364 12.8332 20.5413 10.2215 20.5413 6.99984C20.5413 3.77818 17.8364 1.1665 14.4997 1.1665ZM10.8747 15.1665C7.53795 15.1665 4.83301 17.7782 4.83301 20.9998V24.4998C4.83301 25.1442 5.374 25.6665 6.04134 25.6665C6.70869 25.6665 7.24967 25.1442 7.24967 24.4998V20.9998C7.24967 19.0668 8.87264 17.4998 10.8747 17.4998H18.1247C20.1267 17.4998 21.7497 19.0668 21.7497 20.9998V24.4998C21.7497 25.1442 22.2907 25.6665 22.958 25.6665C23.6254 25.6665 24.1663 25.1442 24.1663 24.4998V20.9998C24.1663 17.7782 21.4614 15.1665 18.1247 15.1665H10.8747Z" fill="#656565"/>
                    </svg>
                </div>
                <span>Профиль</span>
            </RouterLink>
        </div>
    </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--surface-color);
    box-shadow: var(--shadow-sm);
    padding: 10px 0;
    z-index: 1000;
    height: 70px;
    display: flex;
    align-items: center;
}

.nav-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    padding: 0 20px;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 0.75rem;
    padding: 8px 12px;
    border-radius: var(--radius-md);
    transition: all 0.3s ease;
}

.nav-item:hover {
    color: var(--primary-color);
    transform: translateY(-2px);
}

.nav-item.active {
    color: var(--primary-color);
}

.nav-icon {
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
}

.nav-icon svg {
    width: 100%;
    height: 100%;
}

@media (min-width: 768px) {
    .navbar {
        top: 0;
        bottom: auto;
        padding: 0;
        height: 70px;
    }

    .nav-content {
        padding: 0 40px;
    }

    .nav-item {
        flex-direction: row;
        font-size: 0.875rem;
        gap: 8px;
        height: 70px;
        padding: 0 16px;
        border-radius: 0;
    }

    .nav-icon {
        margin-bottom: 0;
    }

    .nav-item:hover {
        transform: none;
        background: var(--surface-variant);
    }

    .nav-item.active {
        box-shadow: inset 0 -2px 0 var(--primary-color);
    }
}
</style>