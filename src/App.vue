<template>
  <div class="h-screen flex flex-col justify-center items-center px-4">
    <div class="flex flex-col items-center">
      <h1 class="text-2xl md:text-3xl font-bold">Convert Speech to Text</h1>
      <p class="text-base text-gray-400 mt-4 text-center md:text-xl">
        Transform your spoken words into written text instantly. <br />
        Simply speak and watch your words appear on screen in real-time.
      </p>
      <p class="text-base text-gray-400 text-center md:text-xl">
        before try it, please visit the link below to see if your browser
        supports the
        <span class="font-bold underline">Speech Recognition API</span>
      </p>
      <a
        class="text-base text-blue-500 underline text-center md:text-xl"
        href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility"
        target="_blank"
        >Here</a
      >
    </div>

    <div
      class="bg-[var(--primary-color)] p-4 rounded-lg flex flex-col items-center mt-10 min-w-[300px] max-w-[500px] w-full mx-auto"
    >
      <div class="flex flex-col w-full">
        <h4 class="text-lg mt-4">1- First Choose Language</h4>
        <v-select
          class="select mt-4"
          :filterable="false"
          :clearable="false"
          :options="options"
          v-model="selected"
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

    <div
      v-show="text"
      class="bg-[var(--primary-color)] p-4 rounded-lg flex flex-col mt-10 min-w-[300px] max-w-[500px] w-full mx-auto"
    >
      <p
        class=""
        id="typewriter"
        :dir="selected.code == 'ar-SA' ? 'rtl' : 'ltr'"
      ></p>
      <button
        class="bg-[var(--secondary-color)] p-2 rounded-lg mt-4 w-fit mx-auto flex items-center gap-2"
        :class="copied ? 'bg-transparent' : ''"
        @click="copyText"
      >
        <svg
          v-if="copied"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-[40px] fill-green-500"
        >
          <title>check</title>
          <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
        </svg>
        <span v-else>Copy</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useSpeechRecognition } from "@vueuse/core";
import { toast } from "vue3-toastify";
import Typewriter from "typewriter-effect/dist/core";

import animationData from "./assets/Animation - 1731920772748.json";

import "vue3-toastify/dist/index.css";

interface Language {
  label: "English" | "Arabic";
  code: "en-US" | "ar-SA";
}

export default defineComponent({
  name: "App",

  setup() {
    const { start, stop, result, recognition, error } = useSpeechRecognition({
      continuous: true,
      interimResults: true,
    });

    return {
      start,
      stop,
      result,
      recognition: recognition as SpeechRecognition,
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

      textArray: [] as string[],
      text: "" as string,
      typewriter: null as Typewriter | null,
      typedText: "" as string,
      copied: false as boolean,
    };
  },

  methods: {
    async startSpeaking() {
      try {
        if (this.error?.error == "not-allowed") {
          throw new Error(
            "Microphone access is not allowed, please allow it in your browser and refresh the page"
          );
        }

        await this.start();
      } catch (err: unknown) {
        const errMessage =
          err instanceof Error ? err.message : "Something went wrong";
        toast(errMessage || "Something went wrong", {
          position: "bottom-center",
          type: "error",
          theme: "dark",
        });
      }
    },

    stopSpeaking() {
      this.isListening = false;
      this.stop();
    },

    initTypewriter() {
      this.typewriter = new Typewriter("#typewriter", {
        delay: 50,
        cursor: "|",
      });
    },

    setupSpeechHandlers() {
      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          this.start();
        } else {
          this.isListening = false;
        }
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = event.results;

        if (results[results.length - 1].isFinal) {
          this.text += results[results.length - 1][0].transcript;
          this.typedText = results[results.length - 1][0].transcript;
          this.typewriter?.typeString(this.typedText + " ").start();
          this.handleStopCommand(this.typedText);
        }
      };
    },

    handleStopCommand(text: string) {
      const stopCommands = {
        English: "stop recording",
        Arabic: "توقف عن التسجيل",
      };

      if (text.toLowerCase().includes(stopCommands[this.selected.label])) {
        this.stopSpeaking();
      }
    },

    copyText() {
      navigator.clipboard.writeText(this.text);
      this.copied = true;
    },
  },

  watch: {
    selected(newVal: Language) {
      this.recognition.lang = newVal.code;
    },
  },

  mounted() {
    this.initTypewriter();
    this.setupSpeechHandlers();
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