(() => {
  const RECORDS_KEY = "signal_demo_records_v1";
  const CAMPAIGNS_KEY = "signal_demo_campaigns_v1";

  function read(key) {
    try {
      const value = JSON.parse(window.localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function makeId(prefix = "SG") {
    const stamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${prefix}-${stamp}-${random}`;
  }

  function getRecords() {
    return read(RECORDS_KEY).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function saveRecord(record) {
    const records = getRecords();
    const item = { ...record, id: record.id || makeId("SG"), createdAt: record.createdAt || new Date().toISOString() };
    const index = records.findIndex(existing => existing.id === item.id);
    if (index >= 0) records[index] = item;
    else records.unshift(item);
    return write(RECORDS_KEY, records) ? item : null;
  }

  function getCampaigns() {
    return read(CAMPAIGNS_KEY).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function saveCampaign(campaign) {
    const campaigns = getCampaigns();
    const item = { ...campaign, id: campaign.id || makeId("CMP"), createdAt: campaign.createdAt || new Date().toISOString() };
    campaigns.unshift(item);
    return write(CAMPAIGNS_KEY, campaigns) ? item : null;
  }

  function reset() {
    try {
      window.localStorage.removeItem(RECORDS_KEY);
      window.localStorage.removeItem(CAMPAIGNS_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  window.SignalStore = { getRecords, saveRecord, getCampaigns, saveCampaign, reset, makeId };
})();
