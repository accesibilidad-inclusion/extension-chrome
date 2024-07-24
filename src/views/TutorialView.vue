<template>
  <div class="bg-light-yellow p-4 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <!-- Logo SVG -->
      <img src="../../public/assets/img/logo.svg" class="app-nav__logo">

    </div>

    <div class="bg-dark-yellow rounded-lg p-4 mb-6" style="border-radius: 20px;">
      <div class="flex justify-center items-center mb-4">
        <p class="font-semibold text-lg text-center">Haz clic en el botón para grabar</p>
        <img 
          v-if="!isSpeaking || activeVoice !== 'voz1'" 
          @click="speakText('Haz clic en el botón para grabar', 'voz1')" 
          :class="iconClass" 
          src="../../public/assets/img/voz.svg">
        <img 
          v-else-if="activeVoice === 'voz1'" 
          @click="stopSpeaking" 
          :class="iconClass + ' animate-pulse2'" 
          src="../../public/assets/img/vozstop.svg" 
          style="height: 27px;">
      </div>
      <div class="flex justify-center">
        <button class="btn-record flex items-center">
          <img src="../../public/assets/img/grabar.svg">
          <span class="ml-2" style="font-weight: 700; font-size: 16px;">Iniciar grabación</span>
        </button>
      </div>
    </div>

    <div class="bg-dark-yellow rounded-lg p-4 mb-6" style="border-radius: 20px;">
      <div class="flex justify-center items-center mb-4">
        <img height="20px" style="position: relative; bottom: 15px; right: 5px;" src="../../public/assets/img/grabarX.svg">
        <p class="font-semibold text-lg flex text-center">Comienza a crear el paso a paso</p>
        <img 
          v-if="!isSpeaking || activeVoice !== 'voz2'" 
          @click="speakText('Comienza a crear el paso a paso', 'voz2')" 
          :class="iconClass" 
          src="../../public/assets/img/voz.svg"
          style="bottom: 15px;left: 0px;">
        <img 
          v-else-if="activeVoice === 'voz2'" 
          @click="stopSpeaking" 
          :class="iconClass + ' animate-pulse2'" 
          src="../../public/assets/img/vozstop.svg"
          style="height: 27px;bottom: 15px;left: 5px;">
      </div>
      <div class="flex justify-around mb-4">
        <img style="margin-right: -25px;" src="../../public/assets/img/cameraTutorial.svg">
        <img style="margin-left: -25px;" src="../../public/assets/img/clickTutorial.svg">
      </div>
      <p class="text-sm flex text-center">Se tomarán capturas de tus acciones en la pagina web y pictos guardara los pasos automáticamente</p>
    </div>

    <div class="mb-6">
      <p class="font-semibold text-lg text-center" style="font-size: 15px;">Ejemplo de un paso capturado</p>
      <br>
      <div class="rounded-lg overflow-hidden">
        <img height="100%" width="100%" src="../../public/assets/img/captura.svg" alt="Ejemplo de paso capturado">
      </div>
    </div>

    <div class="bg-dark-yellow rounded-lg p-4 mb-6" style="border-radius: 20px;">
      <div class="flex justify-center items-center mb-4">
        <p class="font-semibold text-lg flex text-center">Para detener la grabación haz clic en</p>
        <img 
          v-if="!isSpeaking || activeVoice !== 'voz3'" 
          @click="speakText('Para detener la grabación haz clic en el botón Detener grabación', 'voz3')" 
          :class="iconClass" 
          src="../../public/assets/img/voz.svg" 
          style="bottom: 15px;left: 0px;">
        <img 
          v-else-if="activeVoice === 'voz3'" 
          @click="stopSpeaking" 
          :class="iconClass + ' animate-pulse2'" 
          src="../../public/assets/img/vozstop.svg"
          style="height: 27px;bottom: 15px;left: 5px;">
      </div>
      <button class="btn-stop-record">
        <img style="position: relative; bottom: 0px;" src="../../public/assets/img/stop.svg">
        <span class="ml-2 flex text-center" style="font-weight: 700; font-size: 16px;">Detener grabación</span>
      </button>
    </div>
    <br>
    <div class="flex justify-between h-1/2">
    <button class="btn-back w-1/2">Atrás</button>
    <button class="btn-continue w-1/2" @click="showAlert = true">Continuar</button>
  </div>

  <!-- Modal -->
  <div v-if="showAlert" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center" style="z-index: 2;">
    <div class="bg-white rounded-lg p-6 w-3/4 md:w-1/2 lg:w-1/3">
      <img style="width: 25px;position: absolute;right: 70px;" src="../../public/assets/img/escudo.png">
      <h2 class="text-xl font-semibold mb-4">Tu privacidad es primero</h2>
      <p class="mb-4">Pictos.cl no almacena datos personales.</p>
      <button class="btn-continue w-full" @click="proceed">Entendido</button>

    </div>
  </div>
  </div>
</template>

<script lang="ts">
export default  {

  data() {
    return {
      showAlert: false,
      isSpeaking: false,
      utterance: null as SpeechSynthesisUtterance | null,
      iconClass: 'icon-voz',
      activeVoice: null as string | null,
    };
  },
  methods: {
    proceed() {
      this.showAlert = false;
      // Navegar a otra ventana, por ejemplo:
      this.$router.push('/agregar');
    },
    speakText(text: string, voiceId: string) {
      if (!this.isSpeaking && 'speechSynthesis' in window) {
        this.stopSpeaking(); // Detener cualquier discurso previo
        this.isSpeaking = true;
        this.activeVoice = voiceId;
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.onend = this.resetSpeakingState;
        window.speechSynthesis.speak(this.utterance);
      }
    },
    stopSpeaking() {
      if (this.isSpeaking && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        this.resetSpeakingState();
      }
    },
    resetSpeakingState() {
      this.isSpeaking = false;
      this.activeVoice = null;
      this.utterance = null;
    }
  }
};
</script>
<style scoped>
.app-nav__logo {
  width: 75px;
  height: 15px;
}

.bg-light-yellow {
  background-color: #FADA98;
}

.bg-dark-yellow {
  background-color: #F6C254;
}

.bg-dark-blue {
  background-color: #041C42;
}

.btn-record, .btn-stop-record {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  border-radius: 25px;
  font-size: 18px;
  cursor: pointer;
}

.btn-record {
  background-color: #ffffff;
  color: #222;
  border: 1px solid black;
}

.btn-stop-record {
  position: relative;
  padding: 12px 24px;
  border-radius: 9999px;
  background-color: rgb(255, 255, 255);
  color: rgb(25, 25, 25);
  font-weight: 700;
  font-size: 16px;
  overflow: hidden;
  border: 1px solid black;
  box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  animation: pulse 2s infinite;
}

.btn-confirm {
  background-color: #041C42;
  color: #ffffff;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}

.icon-voz {
  position: relative;
  left: 10px;
  z-index: 1;
  cursor: pointer;
}
.animate-pulse2 {
  animation: pulse2 1s infinite;
}

@keyframes pulse2 {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}

/*.btn-back, .btn-continue {
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
}

.btn-back {
  background-color: #fff;
  border: 1px solid #ccc;
  color: #000;
}

.btn-continue {
  background-color: #041C42;
  color: #fff;
}*/
.btn-back,
.btn-continue {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 9999px;
  text-align: center;
  margin: 0 4px; /* Para separar los botones */
}

.btn-back {
  background-color: #FADA98;
  border: 1px solid #222;
  color: #000000;
}

.btn-continue {
  background-color: #041C42;
  color: #ffffff;
}
</style>

  