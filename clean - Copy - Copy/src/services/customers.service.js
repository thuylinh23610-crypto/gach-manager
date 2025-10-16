window.GM_customers = (function(){
  const S=GM_CONST.STORAGE;
  function list(){ return GM_state.customers; }
  function get(id){ return GM_state.customers.find(c=> c.id===id); }
  async function create(data){ data.id=GM_utils.uid(); GM_state.customers.push(data); await persist(); return data; }
  async function update(id,patch){ const c=get(id); if(!c) return null; Object.assign(c,patch); await persist(); return c; }
  async function remove(id){ 
    const customer = get(id);
    if (!customer) return false;
    
    // Move to trash
    if (window.GM_trash) {
      GM_trash.add(customer, 'customer');
    }
    
    const idx=GM_state.customers.findIndex(c=> c.id===id); 
    if(idx>-1){ 
      GM_state.customers.splice(idx,1); 
      await persist(); 
      return true;
    } 
    return false; 
  }
  
  // Add new method for adding customers (used by trash restore)
  async function add(customerData) {
    // Ensure unique ID
    if (!customerData.id || GM_state.customers.find(c => c.id === customerData.id)) {
      customerData.id = GM_utils.uid();
    }
    
    GM_state.customers.push(customerData);
    await persist();
    return customerData;
  }
  
  // Check if customer exists by ID  
  function exists(id) {
    return GM_state.customers.some(c => c.id === id);
  }
  function search(q){ q=q.toLowerCase(); return list().filter(c=> [c.name,c.phone,c.address].some(v=> (v||'').toLowerCase().includes(q))); }
  async function persist(){ await GM_storage.write(S.CUSTOMERS, GM_state.customers); }
  return { list, get, create, update, remove, search, add, exists };
})();