<template>
    <div class="bg-light-yellow p-4 min-h-screen flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-center mb-6">
          <!-- Logo SVG -->
          <img src="../../public/assets/img/logo.svg" class="app-nav__logo">

          <button style="color: #041C42;" @click="cerrar">Cerrar</button>
        </div>
  
        <div class="bg-dark-yellow rounded-lg p-4 mb-6" style="border-radius: 20px;">
          <div class="flex justify-center items-center mb-4">
            <div class="flex justify-center">
              <p class="font-semibold text-lg text-center">
                <span style="font-weight: 300;">Crear tarea</span>
              </p>
            </div>
            <img
              v-if="!isSpeaking || activeVoice !== 'voz1'"
              @click="speakText('Crear tarea', 'voz1')"
              :class="iconClass"
              src="../../public/assets/img/voz.svg"
              class="icon"
            />
            <img
              v-else-if="activeVoice === 'voz1'"
              @click="stopSpeaking"
              :class="iconClass + ' animate-pulse2'"
              src="../../public/assets/img/vozstop.svg"
              style="height: 27px;"
              class="icon"
            />
          </div>
        </div>
  
        <div class="flex mb-4" style="margin-left: 15px; margin-right: 25px;">
          <div class="mb-6">
            <p class="font-semibold text-lg" style="font-size: 17px;">Escribe el nombre de la tarea</p>
          </div>
  
          <img
            v-if="!isSpeaking || activeVoice !== 'voz2'"
            @click="speakText('Escribe el nombre de la tarea.', 'voz2')"
            :class="iconClass"
            src="../../public/assets/img/voz.svg"
            class="icon"
          />
          <img
            v-else-if="activeVoice === 'voz2'"
            @click="stopSpeaking"
            :class="iconClass + ' animate-pulse2'"
            src="../../public/assets/img/vozstop.svg"
            style="height: 27px;"
            class="icon"
          />
        </div>
  
        <div class="flex justify-center w-full mb-4">
          <div class="relative w-full max-w-lg">
            <input
              style="border-radius: 20px; height: 60px; border: 1px solid black; font-size: 18px;"
              type="text"
              v-model="taskName"
              class="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ejemplo: Comprar tarjeta"
              @input="validateInput"
            />
          </div>
        </div>
      </div>
  
      <div class="flex justify-center mb-4">
        <button 
          :class="['btn-continue w-full', { 'opacity-50': !isInputValid, 'opacity-100': isInputValid }]" 
          :disabled="!isInputValid" 
          @click="proceed">
          Continuar
        </button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    data() {
      return {
        showAlert: false,
        isSpeaking: false,
        utterance: null as SpeechSynthesisUtterance | null,
        iconClass: 'icon-voz',
        activeVoice: null as string | null,
        taskName: '',
        isInputValid: false,
      };
    },
    methods: {
        proceed() {
            console.log('Proceed button clicked'); // Verifica que el método se está llamando
            if (this.isInputValid) {
                this.$router.push({ name: 'Grabar', query: { taskName: this.taskName } });
                console.log("esto envia");
                console.log(this.taskName);

            }
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
      },
      cerrar() {
        // Lógica para cerrar
      },
      validateInput() {
            this.isInputValid = this.taskName.trim().length > 0;
            console.log('Input Valid:', this.isInputValid); // Verifica el estado de isInputValid
        },
    }
  };
  </script>
  
  <style scoped>
  .app-nav__logo {
    width: 75px;
    height: 15px;
  }
  
  .bg-light-yellow {
    background-color: #CAE0FF;
  }
  
  .bg-dark-yellow {
    background-color: #A1C9FF;
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
      box-shadow: 0 0 0 0 rgb(255, 0, 0);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
    }
  }
  
  .icon-voz {
    position: absolute;
    right: 25px;
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
    background-color: #CAE0FF;
    border: 1px solid #222;
    color: #000000;
  }
  
  .btn-continue {
    background-color: #041C42;
    color: #ffffff;
  }
  </style>
  