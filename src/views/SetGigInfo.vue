<template>

  <div class="gig-info-container">
    <div class="form-card">
      <form>
        <h2>Create Your Gig</h2>
        <div class="form-group">
          <label for="gig-title">Gig title</label>
          <input type="text" id="gig-title" v-model="gigInfo.title"  maxlength="80">
          <span class="char-count">{{ gigInfo.title.length }} / 80 max</span>
        </div>

        <div class="form-group category-row">
          <label for="category">Category</label>
          <div class="select-group">
            <select id="category" v-model="gigInfo.category">
              <option value="">SELECT A CATEGORY</option>
            </select>
            <select id="subcategory" v-model="gigInfo.subcategory">
              <option value="">SELECT A SUBCATEGORY</option>
            </select>
          </div>
        </div>

        <div class="form-group search-tags">
          <label for="positive-keywords">Search tags</label>
          <label class="sub-label" for="positive-keywords">Positive keywords</label>
          <label class="sub-label" for="positive-keywords">Enter search terms you feel your buyers will use when looking for your service.</label>
          <textarea id="positive-keywords" v-model="gigInfo.tags" ></textarea>
        </div>

        <div class="form-actions">
          <button type = "submit" @click="emitData" class="save-continue">Save & Continue</button>
        </div>
      </form>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      gigInfo: {
        title: '',
        category: '',
        subcategory: '',
        tags: ''
      }
    };
  },
  methods: {
    emitData() {
      this.$emit('next-step', this.gigInfo);
    },
    handleSubmit() {

      console.log('Formulario enviado (simulado)');
      this.emitData();
    }
  }
};
</script>

<style scoped>
.gig-info-container {
  display: flex;
  justify-content: center;
  padding: 50px 20px;
  background-color: #f8f8f8;
  min-height: auto;
}

.form-card {
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 35px;
  width: 660px;
  max-width: 90%;
}

h2 {
  font-size: 2.1em;
  color: #4a4a4a;
  margin-bottom: 28px;
  text-align: left;
  font-weight: 400;
}

.form-group {
  margin-bottom: 28px;
}

label {
  display: block;
  font-weight: 400;
  color: #000000;
  margin-bottom: 7px;
  text-align: left;
  font-size: 0.95em;
}

.sub-label {
  display: block;
  font-size: 0.8em;
  color: #9e9e9e;
  margin-top: 4px;
  font-weight: 300;
}

input,
select,
textarea {
  width: 100%;
  padding: 11px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 0.95em;
  box-sizing: border-box;
  color: #4a4a4a;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 3px rgba(33, 150, 243, 0.3);
}

.char-count {
  display: block;
  text-align: right;
  font-size: 0.7em;
  color: #a3a3a3;
  margin-top: 5px;
}

.category-row .select-group {
  display: flex;
  gap: 8px;
}

.category-row .select-group select {
  flex: 1;
  padding: 11px;
  font-size: 0.95em;
}

.search-tags textarea {
  min-height: 90px;
  font-size: 0.95em;
}

.form-actions {
  margin-top: 28px;
  text-align: right;
}

.save-continue {
  background-color: #29abe2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 22px;
  font-size: 0.95em;
  cursor: pointer;
  font-weight: 400;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.save-continue:hover {
  background-color: #1e88e5;
}


@media (max-width: 768px) {
  .form-card {
    padding: 25px;
    border-radius: 4px;
  }

  h2 {
    font-size: 1.9em;
    margin-bottom: 22px;
  }

  .form-group {
    margin-bottom: 22px;
  }

  .category-row .select-group {
    flex-direction: column;
    gap: 6px;
  }

  .category-row .select-group select {
    padding: 10px;
  }

  .form-actions {
    text-align: center;
    margin-top: 22px;
  }

  .save-continue {
    width: 100%;
    padding: 10px;
    font-size: 0.9em;
  }
}

@media (max-width: 576px) {
  .gig-info-container {
    padding: 20px 10px;
  }

  .form-card {
    padding: 15px;
  }

  h2 {
    font-size: 1.7em;
    margin-bottom: 18px;
  }

  .form-group {
    margin-bottom: 18px;
  }

  label {
    font-size: 0.9em;
    margin-bottom: 4px;
  }

  .sub-label {
    font-size: 0.75em;
    margin-top: 3px;
  }

  input,
  select,
  textarea {
    padding: 9px;
    font-size: 0.85em;
    border-radius: 3px;
  }

  .char-count {
    font-size: 0.65em;
    margin-top: 4px;
  }

  .form-actions {
    margin-top: 18px;
  }

  .save-continue {
    padding: 9px 20px;
    font-size: 0.85em;
  }
}
</style>
