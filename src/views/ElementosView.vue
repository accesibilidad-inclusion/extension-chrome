<template>
  
  <div class="p-6 bg-white min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <!-- Logo SVG -->
      <img src="../../public/assets/img/logo.svg" class="app-nav__logo">

      <button @click="goToHome" style="color: #041C42;font-size: 14px;">Cerrar</button>
    </div>


    <!-- Tipografía -->
    <div>
      <h2 class="text-2xl font-bold mb-4">TIPOGRAFÍA (TÍTULOS Y TEXTOS)</h2>
      <div class="font-open-sans text-xl mb-8">Open Sans</div>
    </div>

    <!-- Escala Tipográfica -->
    <div>
      <h3 class="text-xl font-semibold mb-4">Escala Tipográfica</h3>
      <div class="mb-4">
        <div class="font-title-38">Title</div>
        <div class="text-gray-600">38px / Título destacado inicio</div>
      </div>
      <div class="mb-4">
        <div class="font-title-21">Title</div>
        <div class="text-gray-600">21px / Títulos cabeceras</div>
      </div>
      <div class="mb-4">
        <div class="font-title-18">Title</div>
        <div class="text-gray-600">18px / Títulos secciones</div>
      </div>
      <div class="mb-4">
        <div class="font-title-16">Title</div>
        <div class="text-gray-600">16px / Títulos cards</div>
      </div>
      <div class="mb-4">
        <div class="font-text-14">Text</div>
        <div class="text-gray-600">14px / Todo el contenido</div>
      </div>
    </div>

    <!-- Colores -->
    <div>
      <h3 class="text-xl font-semibold mb-4">Colores</h3>
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 rounded-full mr-4 bg-yellow"></div>
        <div>
          <div class="font-semibold">--color-yellow</div>
          <div>#F6C254</div>
        </div>
      </div>
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 rounded-full mr-4 bg-yellow-light"></div>
        <div>
          <div class="font-semibold">--color-yellow-light</div>
          <div>#FADA98</div>
        </div>
      </div>
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 rounded-full mr-4 bg-blue-dark"></div>
        <div>
          <div class="font-semibold">--color-blue-dark</div>
          <div>#041C42</div>
        </div>
      </div>
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 rounded-full mr-4 bg-skyblue"></div>
        <div>
          <div class="font-semibold">--color-skyblue</div>
          <div>#A1C9FF</div>
        </div>
      </div>
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 rounded-full mr-4 bg-skyblue-light"></div>
        <div>
          <div class="font-semibold">--color-skyblue-light</div>
          <div>#CAE0FF</div>
        </div>
      </div>
    </div>
    <br>
    <h3 class="text-xl font-semibold mb-2">Botones Interiores</h3>
  </div>

    <!-- Botones Interiores -->
  <div>
  <div class="bg-yellow-light p-4">
    <button class="w-full btn-primary">Primary</button>
  </div>
  <div class="bg-skyblue-light p-4">
    <button class="w-full btn-sky-primary">Primary</button>
  </div>
  <div class="bg-blue p-4">
    <button class="w-full btn-blue-primary">Primary</button>
  </div>
  <div class="bg-blue p-4">
    <button class="w-full btn-darkblue-primary">Primary</button>
  </div>


  <div class="bg-yellow-light p-4">
    <button class="w-full btn-primary hover">Hover (primary)</button>
  </div>
  
  <div class="bg-skyblue-light p-4">
    <button class="w-full btn-sky-primary hover">Hover (primary)</button>
  </div>

  <div class="bg-blue p-4">
    <button class="w-full btn-primary hover">Hover (primary)</button>
  </div>

  <div class="bg-blue  p-4">
    <button class="w-full  btn-sky-primary hover">Hover (primary)</button>
  </div>


  <div class="bg-yellow-light p-4">
    <button class="w-full btn-primary inactive"><span class="btn-primary-inactive-text">Inactive</span></button>
  </div>
  <div class="bg-skyblue-light p-4">
    <button class="w-full btn-primary inactive"><span class="btn-primary-inactive-text">Inactive</span></button>
  </div>
  <div class="bg-blue p-4">
    <button class="w-full btn-white inactive"><span class="btn-primary-inactive-text-white">Inactive</span></button>
  </div>


  <div class="bg-yellow-light p-4">
    <button class="w-full btn-secondary">Secondary</button>
  </div>
  <div class="bg-skyblue-light p-4">
    <button class="w-full btn-sky-secondary">Secondary</button>
  </div>
  <div class="bg-blue p-4">
    <button class="w-full btn-blue-secondary">Secondary</button>
  </div>
  <div class="bg-blue p-4">
    <button class="w-full btn-darkblue-secondary">Secondary</button>
  </div>



<!-- Botones con ICON -->
  <div class="bg-yellow-light p-4">
    <button class="w-full btn-icon">      
      <img src="../../public/assets/img/camera.svg">      
      Icon button
    </button>
  </div>
  <div class="bg-skyblue-light p-4">
    <button class="w-full btn-sky-icon">
      <img src="../../public/assets/img/camera.svg">  
      Icon button
    </button>
  </div>
  
  <div class="bg-blue p-4">
    <button class="w-full btn-secondary">
      <img src="../../public/assets/img/camera.svg"> 
      Icon button
    </button>
  </div>

  <div class="bg-blue p-4">
    <button class="w-full btn-darkblue-icon">
      <img src="../../public/assets/img/camera.svg">  
      Icon button
    </button>
  </div>

</div>


<h3 class="text-xl font-semibold mb-2 p-4">Otros Elementos</h3>

    <div class="flex justify-between items-center mb-4" style="font-size: 13px;font-weight: 600;">
      <!-- Botón Atrás con ícono de flecha izquierda -->
      <button class="text-dark-500 flex items-center">
          <!-- Ícono de flecha izquierda -->
          <i class="fas fa-chevron-left mr-2" style="font-size: 32px;"></i>
      </button>

      <!-- Texto central -->
      <span>Paso 1 de 5</span>

      <!-- Botón Siguiente con ícono de flecha derecha -->
      <button class="text-dark-500 flex items-center">
          <!-- Ícono de flecha derecha -->
          <i class="fas fa-chevron-right ml-2" style="font-size: 32px;font-weight: 900;"></i>
      </button>
    </div>

<!-- Tarjeta Titulo -->
  <div class="p-4">
    <div class="bg-yellow rounded-lg p-4 mb-6" style="border-radius: 20px;">
      <div class="flex justify-center items-center mb-2">
          <div class="flex justify-center">
              <p class="font-semibold text-lg text-center">
                <span style="font-weight:300;">Crear tarea</span><br>
                <span style="text-transform: capitalize;">"Titulo de la tarjeta"</span>
              </p>
          </div>
          <img
            v-if="!isSpeaking || activeVoice !== 'voz1'" 
            @click="speakText('Titulo de la tarjeta', 'voz1')" 
            :class="iconClass" 
            src="../../public/assets/img/voz.svg">
          <img 
            v-else-if="activeVoice === 'voz1'" 
            @click="stopSpeaking" 
            :class="iconClassStop + ' animate-pulse2'" 
            src="../../public/assets/img/vozstop.svg" 
            style="height: 27px;">
      </div>
    </div>
  </div>


  <!-- Input y boton que se activa input no vacio-->
  <div class="flex p-2" style="margin-left: 15px; margin-right: 25px;">
          <div class="mb-1">
            <p class="font-semibold text-lg" style="font-size: 17px;">Escribe en el input</p>
          </div>
  
          <img
            v-if="!isSpeaking || activeVoice !== 'voz2'"
            @click="speakText('Escribe el nombre en el input.', 'voz2')"
            :class="iconClass"
            src="../../public/assets/img/voz.svg"
            class="icon"
          />
          <img
            v-else-if="activeVoice === 'voz2'"
            @click="stopSpeaking"
            :class="iconClassStop + ' animate-pulse2'"
            src="../../public/assets/img/vozstop.svg"
            style="height: 27px;"
            class="icon"
          />
        </div>
  
        <div class="flex justify-center w-full p-4">
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
        <div class="flex justify-center p-4 mb-4">
        <button 
          :class="['btn-confirm w-full', { 'opacity-50': !isInputValid, 'opacity-100': isInputValid }]" 
          :disabled="!isInputValid" >
          Continuar
        </button>
      </div>

  <!-- Tarjeta -->
<div class="p-4">
  <div style="background-color: #fff; border-radius: 20px;">
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

              <!-- Contenedor de la lista -->
              <div class="w-full mt-4">
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
                  <button class="flex items-center w-full p-2" style="position: relative; bottom: 18px;">
                      <!-- Icono de '+' -->
                      <span style="font-size: 35px; font-weight: 500;">+</span>
                      <span style="font-size: 15px; font-weight: 500; position: relative; left: 10px; top: 3px;">Agregar Detalles</span>
                  </button>
                  
              </div>
          </div>
      </div>
  </div>

  <!-- Otros Botones -->
    <div class="flex justify-center mb-2 p-4">
        <button class="btn-record flex items-center">
          <img src="../../public/assets/img/grabar.svg">
          <span class="ml-2" style="font-weight: 700; font-size: 16px;">Iniciar grabación</span>
        </button>
     </div>

    <div class="flex justify-center mb-2 p-4">
        <button class="btn-stop-record">
        <img style="height: 32px; position: relative; bottom: 0px;" src="../../public/assets/img/stop.svg">
        <span class="ml-2 flex text-center" style="font-weight: 700; font-size: 16px;">Detener grabación</span>
      </button>
    </div>

    <div class="flex justify-between h-1/2 mb-2 p-4">
        <button class="btn-back w-1/2">Atrás</button>
        <button class="btn-continue w-1/2" @click="showAlert = true">Alerta</button>
    </div>

     <!-- Modal -->
     <div v-if="showAlert" class=" fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div style="border-radius: 20px !important;"  class="bg-white rounded-lg p-6 w-3/4 md:w-1/2 lg:w-1/3">
        <img style="width: 25px;position: absolute;right: 70px;" src="../../public/assets/img/escudo.png">
        <h2 class="text-xl font-semibold mb-4">Tu privacidad es primero</h2>
        <p class="mb-4">Pictos.cl no almacena datos personales.</p>
        <button class="btn-continue w-full" @click="showAlert = false">Entendido</button>
      </div>
    </div>
    
    <div class="p-4 mb-6">
      <div class="bg-yellow rounded-lg p-4 mb-6 flex flex-col justify-center items-center" style="border-radius: 20px; height: 500px;">
        <div class="w-full flex flex-col justify-center items-center h-full text-center">
          <div class="flex justify-center items-center mb-4">
            <p class="font-semibold text-lg text-center">¿Te ha servido este apoyo?</p>
          
          </div>
          <button class="btn-continueYelow font-semibold w-full mb-4">Compartir pasos</button>
        </div>
      </div>
    </div>

      <!-- Boton flotante -->
      <button class="fixed bottom-20 right-4 flex items-center bg-white shadow-lg rounded-full border border-black z-30">
            <div class="p-2 flex items-center justify-center mr-2">
                <img src="../../public/assets/img/video.svg">  
            </div>
            <span class="font-medium" style="margin-right: 25px;">
              Botón Flotante
            </span>
      </button>

    <!-- Separador -->
    <div style="height: 35px;"></div>
    
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      showAlert: false,
      taskName: "",
      isSpeaking: false,
      iconClass: 'icon-voz',
      iconClassStop: 'icon-voz-stop',
      activeVoice: null as string | null,
      isInputValid: false,
      utterance: null as SpeechSynthesisUtterance | null,
    };
  }, methods: {
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
    goToHome(){
      this.$router.push('/');
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
    validateInput() {
            this.isInputValid = this.taskName.trim().length > 0;
        },
  },
  name: 'ElementosView',
});
</script>

<style scoped>

.app-nav__logo {
  width: 75px;
  height: 15px;
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
}.icon-voz-stop {
  position: absolute;
  right: 22px;
  z-index: 1;
  cursor: pointer;
}

.btn-confirm {
  background-color: #041C42;
  color: #ffffff;
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
  background-color: #FADA98;
  border: 1px solid #222;
  color: #000000;
}

.btn-continue {
  background-color: #041C42;
  color: #ffffff;
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

.font-title-38 {
  font-size: 38px;
  font-weight: bold;
}

.font-title-21 {
  font-size: 21px;
  font-weight: bold;
}

.font-title-18 {
  font-size: 18px;
  font-weight: bold;
}

.font-title-16 {
  font-size: 16px;
  font-weight: bold;
}

.font-text-14 {
  font-size: 14px;
}

.bg-yellow {
  background-color: #F6C254;
}

.bg-yellow-light {
  background-color: #FADA98;
}

.bg-blue-dark {
  background-color: #041C42;
}

.bg-blue{
  background-color: #004079;
}

.bg-skyblue {
  background-color: #A1C9FF;
}

.bg-skyblue-light {
  background-color: #CAE0FF;
}

.font-open-sans {
  font-family: 'Open Sans', sans-serif;
}


button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 9999px;
  text-align: center;
  margin: 0 0px; /* Para separar los botones */
}

button:hover {
  opacity: 0.9;
}

/* Primary Buttons */
.btn-primary {
  background-color: #F6C254;
  border: 1px solid #222;
}
.btn-white {
  background-color: #ffffff;
}.btn-white.inactive {
  background-color: rgba(255, 255, 255, 0.1); /* Color con 10% de opacidad */
  border: none;
}

.btn-primary.hover {
  background-color: #F6C254;
}

.btn-primary.inactive {
  background-color: rgba(4, 28, 66, 0.10); /* Color con 10% de opacidad */
  border: none;
}

.btn-primary-inactive-text {
  color: rgba(4, 28, 66, 0.50); /* Color con 50% de opacidad */
  opacity: 1 !important;
}
.btn-primary-inactive-text-white {
  color: rgba(255, 255, 255, 0.5); /* Color con 50% de opacidad */
  opacity: 1 !important;
}

.btn-secondary {
  background-color: #FADA98;
  border: 1px solid #222;
  color: #222;
  img{
    width: 15px;
    position: absolute;
    left: 30%;
    padding-top: 6px;
  }
}

.btn-secondary.hover {
  border-color: #222;
  color: #222;
  background-color: #F6C254;
}

.btn-icon {
  background-color: #F6C254;
  border: 1px solid #222;
  img{
    width: 15px;
    position: absolute;
    left: 30%;
    padding-top: 6px;
  }
}

/* Sky Blue Buttons */
.btn-sky-primary {
  background-color: #A1C9FF;
  border: 1px solid transparent;
  border: 1px solid #222;
}

.btn-sky-primary.hover {
  background-color: #CAE0FF;
}

.btn-sky-primary.inactive {
  background-color: #CAE0FF;
  color: #041C42;
}

.btn-sky-secondary {
  background-color: transparent;
  border: 1px solid #222;
  color: #222;
}

.btn-sky-secondary.hover {
  border-color: #CAE0FF;
  color: #CAE0FF;
}

.btn-sky-icon {
  background-color: #A1C9FF;
  border: 1px solid #222;
  img{
    width: 15px;
    position: absolute;
    left: 30%;
    padding-top: 6px;
  }
}

/* Blue Buttons */
.btn-blue-primary {
  background-color: #FADA98;
  border: 1px solid #222;
}

.btn-blue-primary.hover {
  background-color: #003366;
}

.btn-blue-primary.inactive {
  background-color: #003366;
  color: #A1C9FF;
}

.btn-blue-secondary {
  background-color: transparent;
  border: 1px solid #FADA98;
  color: #FADA98;
}

.btn-blue-secondary.hover {
  border-color: #003366;
  color: #003366;
}

.btn-blue-icon {
  background-color: #041C42;
  border: 1px solid transparent;
}

/* Dark Blue Buttons */
.btn-darkblue-primary {
  background-color: #CAE0FF;
  border: 1px solid #222;
}

.btn-darkblue-primary.hover {
  background-color: #003366;
}

.btn-darkblue-primary.inactive {
  background-color: #003366;
  color: #A1C9FF;
}

.btn-darkblue-secondary {
  background-color: #CAE0FF;
  border: 1px solid #222;
  color: #222;
}

.btn-darkblue-secondary.hover {
  border-color: #003366;
  color: #003366;
}

.btn-darkblue-icon {
  background-color: #CAE0FF;
  border: 1px solid #222;
  img{
    width: 15px;
    position: absolute;
    left: 30%;
    padding-top: 6px;
  }
}

/* Feedback Buttons */
.btn-feedback {
  background-color: #F6C254;
  border: 1px solid transparent;
  font-size: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.btn-feedback.selected {
  background-color: #041C42;
  color: white;
}

/* Navigation Buttons */
.btn-nav {
  background-color: #041C42;
  border: 1px solid transparent;
  color: white;
  padding: 10px 20px;
}

.btn-nav.active {
  background-color: #041C42;
}

.btn-nav.hover {
  background-color: #003366;
}

.btn-nav.inactive {
  background-color: #FADA98;
}

.btn-nav.secondary {
  background-color: #A1C9FF;
}

.btn-nav.add {
  background-color: #F6C254;
  color: #041C42;
  font-weight: bold;
}

.btn-continueYelow {
  background-color: #FADA98;
  color: #222;
  border: 1px solid #222;
  font-weight: 700 !important;
}
</style>
