<template>
  <div class="bg-light-yellow p-4 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <!-- Logo SVG -->
      <img src="../../public/assets/img/logo.svg" class="app-nav__logo">

      <button style="color: #041C42;">Cerrar</button>
    </div>


    <div class="flex justify-center">
              <p class=" text-lg text-center">
                <span style="text-transform: capitalize;">{{ taskName }}</span>
              </p>
              <img 
        v-if="!isSpeaking || activeVoice !== 'voz1'" 
        @click="speakText(taskName, 'voz1')" 
        :class="iconClass" 
        src="../../public/assets/img/voz.svg">
      <img 
        v-else-if="activeVoice === 'voz1'" 
        @click="stopSpeaking" 
        :class="iconClass + ' animate-pulse2 ml-2'" 
        src="../../public/assets/img/vozstop.svg" 
        style="height: 27px;"> 
    </div>

    <br>

    <div v-show="showCard" class="bg-dark-yellow rounded-lg p-4 mb-6 flex flex-col justify-center items-center" style="border-radius: 20px; height: 500px;">
      <div class="w-full flex flex-col justify-center items-center h-full text-center">
        <div class="flex justify-center items-center mb-4">
          <p class="font-semibold text-lg text-center">¿Te ha servido este apoyo?</p>
        
        </div>
        <button class="btn-continueYelow font-semibold w-full mb-4" @click="proceed">Compartir pasos</button>
      </div>
    </div>



    <div v-show="!showCard" style="background-color: #fff; border-radius: 20px;">
        <div class="relative mb-4">
            <img src="../../public/assets/img/captura2.png" 
                 alt="Ejemplo de pantalla" 
                 class="w-full rounded-t-[20px] rounded-b-none" 
                 style="border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
        </div>

        <div id="tarjeta" style="margin-left: 20px; margin-right: 20px;">
            <div class="flex mb-4">
                <!-- Columna para la imagen -->
                <div class="flex-shrink-0 mr-4">
                    <img src="../../public/assets/img/web.svg" width="50px" alt="Ejemplo de pantalla" class="rounded-lg">
                </div>

                <!-- Columna para el texto -->
                <div class="flex-grow">
                    <h4 class="text-lg font-semibold mb-2" style="font-size: 12px; color: #004079;">PASO 1</h4>
                    <p class="flex items-center mb-2" style="font-size: 15px; font-weight: 500;">
                        Haz click sobre la opción “Clave Única” en el menú de la página de inicio
                    </p>
                </div>
            </div>

            <!-- Contenedor del botón -->
            <div class="w-full mt-4">
               <!-- <button class="flex items-center w-full p-2 rounded-md" style="position: relative; bottom: 18px;">

                    <span style="font-size: 40px; font-weight: 500;">+</span>
                    <span style="font-size: 15px; font-weight: 500; position: relative; left: 10px; top: 3px;">Agregar Detalles</span>
                </button>-->
                <ol class="list-decimal ml-6 mb-4">
      <li class="mb-2" style="font-size: 16px; font-weight: 500;">
        Ingresa tu identificador Run o Rut con el dígito verificador
      </li>
      <li class="mb-2" style="font-size: 16px; font-weight: 500;">
        Ingresa el número de documento que sale en tu carnet de identidad
      </li>
      <li class="mb-2" style="font-size: 16px; font-weight: 500;">
        Ingresa tu correo electrónico
      </li>
      <li class="mb-2" style="font-size: 16px; font-weight: 500;">
        Vuelve a ingresar tu correo electrónico de confirmación
      </li>
      <li class="mb-2" style="font-size: 16px; font-weight: 500;">
        Ingresa tu teléfono personal. Puedes cambiar el código de país, si no vives en Chile
      </li>
      <li class="mb-2" style="font-size: 16px; font-weight: 500;">
        Presiona el botón “ingresar solicitud”
      </li>
    </ol>
    <br>
            </div>
        </div>
    </div>


    <br>
    <div class="flex justify-between h-1/2">
        <button class="btn-back w-1/2">Atrás</button>
        <button v-show="!showCard" class="btn-continue w-1/2" @click="siguiente">Siguiente</button>
        <button v-show="showCard" class="btn-continue w-1/2" @click="previsualizar">Guardar</button>
    </div>

    <!-- Modal -->
    <div v-if="showAlert" class=" fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
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
export default {
  props: {
    taskName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showAlert: false,
      isSpeaking: false,
      isRecording: false,
      showCard: false,
      utterance: null as SpeechSynthesisUtterance | null,
      iconClass: 'icon-voz',
      activeVoice: null as string | null,
    };
  },
  created() {
    console.log('taskName previsualizar:', this.taskName); // Verifica si taskName está recibido correctamente
  },
  methods: {
    proceed() {
      this.showAlert = false;
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
    },
    startRecording() {
      this.isRecording = true;
      this.showCard = false;
    },
    stopRecording() {
      this.isRecording = false;
      this.showCard = true;
    },
    previsualizar() {
      window.open('URL_DE_PREVISUALIZACION', '_blank'); // Cambia 'URL_DE_PREVISUALIZACION' por la URL deseada
    },
    cerrar() {
      // Lógica para cerrar
    },
    atras() {
      // Lógica para retroceder paso
    },
    siguiente() {
      // Lógica para avanzar paso
      this.showCard = true;
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
.btn-continueYelow,
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
  color: #222;
}

.btn-continue {
  background-color: #041C42;
  color: #ffffff;
}
.btn-continueYelow {
  background-color: #FADA98;
  color: #222;
  border: 1px solid #222;
  font-weight: 700 !important;
}
</style>

  