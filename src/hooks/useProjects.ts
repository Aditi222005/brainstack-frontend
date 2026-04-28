import { useState, useEffect, useCallback } from "react";

export interface Project {
  _id: string;
  name: string;
  description: string;
  color: string;
  isDefault: boolean;
  ideaCount: number;
  edgeCount: number;
  createdAt: string;
}

const API = "http://localhost:5000/api";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/projects`, {
        credentials: "include",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setProjects(json.data ?? []);
      } else {
        setError(json.message || "Failed to load projects");
      }
    } catch (err) {
      setError("Could not reach backend");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = useCallback(async (data: { name: string; description: string; color: string }) => {
    const res = await fetch(`${API}/projects`, {
      method: "POST",
      credentials: "include",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success && json.data) {
      setProjects(prev => [json.data, ...prev]);
      return json.data as Project;
    }
    throw new Error(json.message || "Failed to create project");
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    const res = await fetch(`${API}/projects/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: authHeaders(),
    });
    const json = await res.json();
    if (json.success) {
      setProjects(prev => prev.filter(p => p._id !== id));
      return true;
    }
    throw new Error(json.message || "Failed to delete project");
  }, []);

  /** Update the local count after an idea is added to a project */
  const incrementIdeaCount = useCallback((projectId: string) => {
    setProjects(prev =>
      prev.map(p => p._id === projectId ? { ...p, ideaCount: p.ideaCount + 1 } : p)
    );
  }, []);

  return { projects, loading, error, fetchProjects, createProject, deleteProject, incrementIdeaCount };
}
