window.GM_history = (function(){
  const S=GM_CONST.STORAGE;
  function list(){ return GM_state.history.slice().sort((a,b)=> b.date.localeCompare(a.date)); }
  async function add(record){ record.id=GM_utils.uid(); record.date = record.date || GM_utils.nowISO(); GM_state.history.push(record); await persist(); }
  async function persist(){ await GM_storage.write(S.HISTORY, GM_state.history); }
  return { list, add };
})();