class NoiseReducer extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      const output = outputs[0];
  
      for (let channel = 0; channel < output.length; ++channel) {
        const inputChannel = input[channel];
        const outputChannel = output[channel];
  
        for (let i = 0; i < inputChannel.length; ++i) {
          // Terapkan logika pengurangan noise sederhana
          outputChannel[i] = inputChannel[i] > 0.01 ? inputChannel[i] : 0; // Menghilangkan sinyal di bawah ambang batas
        }
      }
      return true;
    }
  }
  
  registerProcessor('noise-reducer', NoiseReducer);