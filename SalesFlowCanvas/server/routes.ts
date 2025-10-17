import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getDeals();
      res.json(deals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/:id", async (req, res) => {
    try {
      const deal = await storage.getDeal(req.params.id);
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deal" });
    }
  });

  app.get("/api/team", async (req, res) => {
    try {
      const teamMembers = await storage.getTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.get("/api/reps/:id", async (req, res) => {
    try {
      const rep = await storage.getRep(req.params.id);
      if (!rep) {
        return res.status(404).json({ error: "Rep not found" });
      }
      res.json(rep);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rep" });
    }
  });

  app.get("/api/reps/:id/actions", async (req, res) => {
    try {
      const actions = await storage.getRepStageActions(req.params.id);
      res.json(actions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rep actions" });
    }
  });

  app.get("/api/reps/:id/calls", async (req, res) => {
    try {
      const calls = await storage.getRepCalls(req.params.id);
      res.json(calls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rep calls" });
    }
  });

  app.get("/api/calls/:id", async (req, res) => {
    try {
      const callDetail = await storage.getCallDetail(req.params.id);
      if (!callDetail) {
        return res.status(404).json({ error: "Call not found" });
      }
      res.json(callDetail);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch call detail" });
    }
  });

  app.get("/api/team/actions", async (req, res) => {
    try {
      const actions = await storage.getTeamStageActions();
      res.json(actions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team actions" });
    }
  });

  app.get("/api/team/coaching-priorities", async (req, res) => {
    try {
      const priorities = await storage.getCoachingPriorities();
      res.json(priorities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coaching priorities" });
    }
  });

  app.get("/api/team/adoption-trends", async (req, res) => {
    try {
      const trends = await storage.getAdoptionTrends();
      res.json(trends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch adoption trends" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
