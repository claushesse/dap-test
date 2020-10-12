const basefreq = document.getElementById('basefreq'),
      altfreq = document.getElementById('altfreq'),
      start = document.getElementById('start'),
      cambio = document.getElementById('cambio'),
      reset = document.getElementById('reset'),
      result = document.getElementById('result'),
      audioContext = new (window.AudioContext || window.webkitAudioContext)(),
      osc = audioContext.createOscillator(),
      gain = audioContext.createGain(),
      lowChart = document.getElementById('lowChart').getContext('2d'),
      lowMidChart = document.getElementById('lowMidChart').getContext('2d'),
      highMidChart = document.getElementById('highMidChart').getContext('2d'),
      highChart = document.getElementById('highChart').getContext('2d');

let baseFrequency,
    altFrequency,
    lowData = [],
    lowMidData = [],
    highMidData = [],
    highData = [],
    lowInstance,
    lowMidInstance,
    highMidIntance,
    highInstance;

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
      lowData.push({x: baseFrequency, y: difference})
      lowInstance = new Chart(lowChart, {
        type: 'line',
        data: {
            datasets: [{
                label: 'JND LOW FREQ.',
                lineTension: 0,
                data: lowData
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
    if(baseFrequency >= 300 && baseFrequency < 1200){
      lowMidData.push({x: baseFrequency, y: difference})
      lowMidInstance = new Chart(lowMidChart, {
        type: 'line',
        data: {
            datasets: [{
                label: 'JND LOW MID FREQ.',
                lineTension: 0,
                data: lowMidData
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
    if(baseFrequency >= 1200 && baseFrequency < 5000){
      highMidData.push({x: baseFrequency, y: difference})
      highMidIntance = new Chart(highMidChart, {
        type: 'line',
        data: {
            datasets: [{
                label: 'JND HIGH MID FREQ.',
                lineTension: 0,
                data: highMidData
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
    if(baseFrequency >= 5000 && baseFrequency < 20000){
      highData.push({x: baseFrequency, y: difference})
      highMidIntance = new Chart(highChart, {
        type: 'line',
        data: {
            datasets: [{
                label: 'JND HIGH FREQ.',
                lineTension: 0,
                data: highData
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

    let resultDiv = document.createElement("div");
    resultDiv.classList.add("result")
    let noteName = document.createTextNode(`DAP for base freq ${baseFrequency} Hz is: ${difference} Hz`);
    resultDiv.appendChild(noteName);
    result.appendChild(resultDiv);
  }
});

reset.addEventListener('click', () => {
  result.innerHTML = "";
  lowData = [];
  lowMidData = [];
  highMidData = [];
  highData = [];
  lowChart.clear();
  lowMidChart.clear();
  highMidChart.clear();
  highChart.clear();
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
