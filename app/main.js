const emitter = mitt();
const inputComponent = {
    template: `<input class="input is-small" type="text" :placeholder="placeholder" v-model="noteInput" @keyup.enter="monitorEnterKey" />`,
    props: ['placeholder'],
    data() {
        return {
            noteInput: '',
        }
    },
    methods: {
        monitorEnterKey(e) {
            emitter.emit('add-note', { note: this.noteInput, timestamp: new Date().toLocaleString() });
            this.noteInput = '';
        }
    },
    emits: ['add-note']
};

const noteCountComponent = {
    template: `<div class="note-count">Note count: <strong>{{ noteCount }}</strong></div>`,
    data() {
        return {
            noteCount: 0,
        };
    },
    created(){
        emitter.on('add-note', () => {
            this.noteCount++;
        });
    }
};

const app = {
    components: {
        'input-component': inputComponent,
        'note-count-component': noteCountComponent,
    },
    data() {
        return {
            notes: [],
            timestamps: [],
            placeholder: 'Enter a note',
        }
    },
    methods: {
        addNote(event) {
            this.notes.push(event.note);
            this.timestamps.push(event.timestamp);
        }
    },
    created() {
        emitter.on('add-note', this.addNote);
    }
};

Vue.createApp(app).mount('#app');
