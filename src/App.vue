<template>
    <div class="h-full">
        <main class="">
            <div class="h-full mb-[70px]">
                <RouterView />
            </div>
        </main>
        <div
            class="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex justify-center items-center space-x-4 h-[70px]"
        >
            <router-link
                v-if="$route.path === '/'"
                to="/recording"
                class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 w-full text-center font-medium"
            >
                Ir a interfaz de grabación
            </router-link>
            <router-link
                v-if="$route.path === '/recording'"
                to="/"
                class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full text-center font-medium"
            >
                Volver a inicio
            </router-link>
        </div>
    </div>
</template>
