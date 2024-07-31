<template>
    <main>
      <div class="h-full mb-[0px]">
        <RouterView />
      </div>
    </main>
    <div
      class="fixed z-[0] bg-yellow bottom-0 left-0 w-full shadow-lg p-4 flex justify-center items-center space-x-4"
    >
      <!--<router-link
        v-if="$route.path === '/'"
        to="/recording"
        class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 w-full text-center font-medium"
      >
        {{ getMessage("goToRecordInterface") }}
      </router-link>-->
      <router-link
        v-if="$route.path === '/recording'"
        to="/"
        class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full text-center font-medium"
      >
        {{ getMessage("backToHome") }}
      </router-link>

      <router-link v-if="$route.path === '/'" to="/recording" >
        <button class="fixed bottom-5 right-4 flex items-center bg-white shadow-lg rounded-full border border-black">

        <div class="p-2 flex items-center justify-center mr-2">
          <img src="../public/assets/img/video.svg" />
        </div>
        <span class="font-medium" style="margin-right: 25px;">
            {{ getMessage("goToRecordInterface") }}
        </span>
      </button>
    </router-link>
</div>
  
    <!-- Espacio adicional -->
    <div v-if="$route.path === '/'" ref="extraSpace" class="extra-space"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed, onUnmounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { addListener, getMessage } from '@/scripts/types';
  
  const router = useRouter();
  const route = useRoute();
  
  const showExtraSpace = ref(false);
  const extraSpace = ref<HTMLDivElement | null>(null);
    const mainClass = computed(() => route.path === '/' ? 'bg-yellow' : 'bg-blue-dark');
const bottomClass = computed(() => route.path === '/' ? 'bg-yellow' : 'bg-blue-dark');

  const handleScroll = () => {
    if (extraSpace.value) {
      //const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
     // extraSpace.value.style.height = bottomOfWindow ? '100px' : '0px';
    }
  };
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  
    addListener((request) => {
      if (request.action === 'NAVIGATE_TO_EDITOR') {
        router.push('/editor');
      }
    });
  });
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  </script>
  
  <style>
  .extra-space {
    background-color: #F6C254; /* Para que coincida con el color de fondo de la página */
    height: 50px; /* Comienza con 0px de altura */
  }
  
  .bg-yellow {
    background-color: #F6C254;
    border-radius: 10px 10px 0 0;
  }
  .bg-blue-dark {
     background-color: #041C42;
  }
  </style>
  