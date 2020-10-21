const basefreq = document.getElementById('basefreq'),
      altfreq = document.getElementById('altfreq'),
      start = document.getElementById('start'),
      cambio = document.getElementById('cambio'),
      reset = document.getElementById('reset'),
      results = document.getElementById('result'),
      audioContext = new (window.AudioContext || window.webkitAudioContext)(),
      osc = audioContext.createOscillator(),
      gain = audioContext.createGain(),
      chart = document.getElementById('chart').getContext('2d');

let baseFrequency,
    altFrequency,
    chartInstance,
    data = [];

osc.type = 'sine';
osc.connect(gain);
osc.start();

start.addEventListener('click', () => {
  audioContext.resume().then(() => {
    console.log('Playback resumed successfully');
    startSound();
  });
});

cambio.addEventListener('click', () => {
  if(!isNaN(baseFrequency - altFrequency)){
    let difference = Math.abs(altFrequency - baseFrequency)
    if(baseFrequency >= 20 && baseFrequency <= 20000){
      console.log('ENTRE')
      makeChart(chartInstance, chart, difference, baseFrequency, 'JND RESULTS', data);
    }

    check = document.getElementById(`${baseFrequency}`);
    if(!check){
      let resultDiv = document.createElement("div");
      resultDiv.classList.add("result")
      resultDiv.setAttribute("id", `${baseFrequency}`);
      let noteName = document.createTextNode(`JND for base freq ${baseFrequency} Hz is: ${difference} Hz`);
      resultDiv.appendChild(noteName);
      results.appendChild(resultDiv);
    }
  }
});

reset.addEventListener('click', () => {
  result.innerHTML = "";
  lowData = [];
  lowMidData = [];
  highMidData = [];
  highData = [];

  if(chartInstance){
    chartInstance.clear()
  }
});

function startSound(){
  baseFrequency = Number(basefreq.value).toFixed(1);
  altFrequency = Number(altfreq.value).toFixed(1);
  gain.gain.setValueAtTime(0.01, audioContext.currentTime);
  osc.frequency.setValueAtTime(baseFrequency, audioContext.currentTime);
  gain.connect(audioContext.destination);
  gain.gain.exponentialRampToValueAtTime(1.0, audioContext.currentTime + 0.5);
  setTimeout(() => {
    osc.frequency.setValueAtTime(altFrequency, audioContext.currentTime);
    setTimeout(() => {
      osc.frequency.setValueAtTime(baseFrequency, audioContext.currentTime);
      setTimeout(() => {
        gain.gain.cancelScheduledValues(audioContext.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        setTimeout(() => {
          gain.disconnect(audioContext.destination);
        }, 500)
      }, 5000);
    }, 5000);
  }, 5000);
};

function makeChart(instance, chart, dif, baseFreq, label, data){
  const check = data.findIndex(node => {
    return node.x === baseFreq;
  }) === -1;
  
  if(check){
    data.push({x: baseFreq, y: dif})
    instance = new Chart(chart, {
      type: 'line',
      data: {
        datasets: [{
          label: `JND ${label} FREQ.`,
          lineTension: 0,
          data: data
        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom',
            ticks: {
              beginAtZero: true,
              suggestedMax: 20000
            }
          }],
          yAxes: [{
            type: 'linear',
            ticks: {
              beginAtZero: true,
              suggestedMax: 5
            }
          }]
        }
      }
    });
  }
}