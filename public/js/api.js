// API helper – base URL auto-detected
const API = {
    base: window.location.origin,

    async get(path) {
        const token = localStorage.getItem('nadhi_admin_token');
        const res = await fetch(this.base + path, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async post(path, data) {
        const token = localStorage.getItem('nadhi_admin_token');
        const res = await fetch(this.base + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async put(path, data) {
        const token = localStorage.getItem('nadhi_admin_token');
        const res = await fetch(this.base + path, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async patch(path, data) {
        const token = localStorage.getItem('nadhi_admin_token');
        const res = await fetch(this.base + path, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async delete(path) {
        const token = localStorage.getItem('nadhi_admin_token');
        const res = await fetch(this.base + path, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async upload(formData) {
        const res = await fetch(this.base + '/api/upload', {
            method: 'POST',
            body: formData
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }
};
