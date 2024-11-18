<template>
  <div class="py-10">
    <div class="flex flex-col items-center">
      <h1 class="text-3xl font-bold">Convert Speech to Text</h1>
      <p class="text-lg text-gray-400 mt-4 text-center">
        Transform your spoken words into written text instantly. <br />
        Simply speak and watch your words appear on screen in real-time.
      </p>
    </div>
    <div
      class="bg-[var(--primary-color)] p-4 rounded-lg flex flex-col items-center flex-1 mt-10 min-w-[300px] max-w-[500px] w-full mx-auto"
    >
      <div class="flex flex-col w-full">
        <h4 class="text-lg mt-4">1- First Choose Language</h4>
        <v-select
          class="select mt-4"
          autocomplete="off"
          :filterable="false"
          :clearable="false"
          :options="options"
          v-model="selected.label"
        />
        <h4 class="text-lg mt-4">2- Start Speaking</h4>
        <button
          v-if="!isListening"
          class="bg-[var(--secondary-color)] p-2 rounded-lg mt-4"
          @click="startSpeaking"
        >
          Start
        </button>

        <Vue3Lottie
          v-if="isListening"
          class="cursor-pointer"
          @click="stopSpeaking"
          :animationData="animationData"
          :height="200"
          :width="200"
        />

        <small v-if="isListening" class="text-gray-400 text-center mt-4">
          {{
            selected.label == "English"
              ? "To stop speaking, say just say 'Stop recording'"
              : "To stop speaking, say just say 'توقف عن التسجيل'"
          }}
        </small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useSpeechRecognition } from "@vueuse/core";
import Vue3Lottie from "vue3-lottie";
import animationData from "./assets/Animation - 1731920772748.json";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

interface Language {
  label: "English" | "Arabic";
  code: "en-US" | "ar-SA";
}

export default defineComponent({
  name: "App",

  components: {
    Vue3Lottie,
  },

  setup() {
    const { start, stop, result, recognition, isSupported, error } =
      useSpeechRecognition({
        continuous: true,
        interimResults: true,
      });

    return {
      start,
      stop,
      result,
      isSupported,
      recognition,
      animationData,
      error,
    };
  },

  data() {
    return {
      isListening: false as boolean,

      options: [
        {
          label: "English",
          code: "en-US",
        },
        {
          label: "Arabic",
          code: "ar-SA",
        },
      ] as Language[],

      selected: {
        label: "English",
        code: "en-US",
      } as Language,
    };
  },

  methods: {
    async startSpeaking() {
      try {
        if (
          this.error?.error == "not-allowed" ||
          typeof this.error == "undefined"
        ) {
          throw new Error(
            "Microphone access is not allowed, please allow it in your browser and refresh the page"
          );
        }

        await this.start();
      } catch (err) {
        toast(err.message || "Something went wrong", {
          position: "bottom-center",
          type: "error",
          theme: "dark",
        });
      }
    },

    stopSpeaking() {
      this.stop();
    },
  },

  watch: {
    selected(newVal: Language) {
      this.recognition.lang = newVal.code;
    },
  },

  mounted() {
    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  },
});
</script>

<style>
.select .vs__search::placeholder,
.select .vs__dropdown-toggle,
.select .vs__dropdown-menu {
  background: var(--secondary-color);
  border: none;
  color: var(--text-color);
  text-transform: capitalize;
  font-variant: small-caps;
  font-family: Arial, Helvetica, sans-serif;
}

.select .vs__selected {
  color: var(--text-color);
}

.select .vs__clear,
.select .vs__open-indicator {
  fill: var(--text-color);
}
</style>