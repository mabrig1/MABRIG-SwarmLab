
(function(){
  const isBuildRx=false;
  const btn=document.getElementById('handoff-buildrx');
  btn?.addEventListener('click',async()=>{
    const mission=document.getElementById('mission-input').value.trim();
    const status=document.getElementById('handoff-status');
    if(mission.length<15){status.textContent='Write at least 15 characters before continuing.';document.getElementById('mission-input').focus();return;}
    if(isBuildRx){
      try {
        sessionStorage.setItem('buildrx-swarmlab-brief',mission.slice(0,1500));
        status.textContent='Brief saved in this browser session. BuildRx will ask you to review it in the New Project dialog.';
        location.assign('/projects');
      }catch(e){status.textContent='Browser storage is blocked. Copy the mission manually into BuildRx Projects.';}
      return;
    }
    let copied=false;
    try{await navigator.clipboard.writeText(mission);copied=true;}catch(e){}
    if(!copied){window.prompt('Copy this non-sensitive mission into BuildRx → New project:',mission);}
    status.textContent=copied?'Mission copied. Paste it into the BuildRx New Project dialog.':'Use the displayed mission to create a project in BuildRx.';
    window.open('https://www.buildrx.online/projects','_blank','noopener,noreferrer');
  });
})();
