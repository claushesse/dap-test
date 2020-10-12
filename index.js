const basefreq = document.getElementById('basefreq'),
      altfreq = document.getElementById('altfreq'),
      start = document.getElementById('start'),
      cambio = document.getElementById('cambio'),
      reset = document.getElementById('reset'),
      results = document.getElementById('result'),
      audioContext = new (window.AudioContext || window.webkitAudioContext)(),
      osc = audioContext.createOscillator(),
      gain = audioContext.createGain(),
      lowChart = document.getElementById('lowChart').getContext('2d'),
      lowMidChart = document.getElementById('lowMidChart').getContext('2d'),
      highMidChart = document.getElementById('highMidChart').getContext('2d'),
      highChart = document.getElementById('highChart').getContext('2d'),
      L_STR = 'LOW',
      L_M_STR = 'LOW MID',
      H_M_STR = 'HIGH MID',
      H_STR = 'HIGH',
      instances = {
        lowInstance: '',
        lowMidInstance: '',
        highMidInstance: '',
        highInstance: ''
      };

let baseFrequency,
    altFrequency,
    lowData = [],
    lowMidData = [],
    highMidData = [],
    highData = [];

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
    if(baseFrequency < 300 && baseFrequency > 0){
      makeChart('lowInstance', lowChart, difference, baseFrequency, L_STR, lowData);
    }
    else if(baseFrequency >= 300 && baseFrequency < 1200){
      makeChart('lowMidInstance', lowMidChart, difference, baseFrequency, L_M_STR, lowMidData);
    }
    else if(baseFrequency >= 1200 && baseFrequency < 5000){
      makeChart('highMidInstance', highMidChart, difference, baseFrequency, H_M_STR, highMidData);
    }
    else if(baseFrequency >= 5000 && baseFrequency < 20000){
      makeChart('highInstance', highChart, difference, baseFrequency, H_STR, highData);
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

  for(let instance in instances){
    if(instances[instance]){
      instances[instance].clear();
    }
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
    instances[instance] = new Chart(chart, {
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
            position: 'bottom'
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