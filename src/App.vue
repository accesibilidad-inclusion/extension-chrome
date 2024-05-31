<template>
    <div class="h-full">
        <main class="">
            <div class="h-full mb-[70px]">
                <RouterView />
            </div>
        </main>
        <div class="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex justify-center space-x-4 h-[70px]">
            <button v-if="$route.path === '/'"
                class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 flex-1">
                <router-link to="/recording">
                    Ir a interfaz de grabación
                </router-link>
            </button>
            <button v-if="$route.path === '/recording'">
                <router-link to="/" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex-1">
                    Volver a inicio
                </router-link>
            </button>
        </div>
    </div>

</template>