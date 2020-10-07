const basefreq = document.getElementById('basefreq'),
      altfreq = document.getElementById('altfreq'),
      start = document.getElementById('start'),
      cambio = document.getElementById('cambio'),
      reset = document.getElementById('reset'),
      result = document.getElementById('result'),
      audioContext = new (window.AudioContext || window.webkitAudioContext)(),
      osc = audioContext.createOscillator(),
      gain = audioContext.createGain(),
      ctx = document.getElementById('myChart').getContext('2d');

let baseFrequency,
    altFrequency,
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
    data.push({x: baseFrequency, y: altFrequency - baseFrequency})
    new Chart(ctx, {
      type: 'line',
      data: {
          datasets: [{
              label: 'ADP TEST RESULTS',
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
                    suggestedMax: 7
                }
            }]
          }
      }
    });

    let resultDiv = document.createElement("div");
    resultDiv.classList.add("result")
    let noteName = document.createTextNode(`DAP for base freq ${baseFrequency} Hz is: ${altFrequency - baseFrequency} Hz`);
    resultDiv.appendChild(noteName);
    result.appendChild(resultDiv);
  }
});

reset.addEventListener('click', () => {
  result.innerHTML = "";
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
