import { Request, Response } from "express";
import redis from "../config/redis";
import { v4 as uuid } from "uuid";

export async function helpFaq(req: Request, res: Response): Promise<void> {
  try {
    const { heading, description, category } = req.body;
    if (!heading || !description) {
      res.status(400).json({ error: "Heading and description are required" });
      return;
    }
    const faq = {
      id: uuid(), // simple unique ID
      // id: Date.now().toString(), // simple unique ID
      heading,
      description,
    };
    await redis.rpush(`helpFaqs:${category}`, JSON.stringify(faq));
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getHelpFaqList(req: Request, res: Response): Promise<void> {
  try {
    const { category } = req.body;
    const faqs = await redis.lrange(`helpFaqs:${category}`, 0, -1);
     const parsedFaqs = faqs.map(faq => {
      const parsed = JSON.parse(faq);
      return { ...parsed, category };
    });
    res.status(200).json(parsedFaqs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function updateHelpFaq(req: Request, res: Response): Promise<void> {
  try {
    const { category, id, heading, description } = req.body;
    if (!category || !id || !heading || !description) {
      res.status(400).json({ error: "Category, id, heading, and description are required" });
      return;
    }
    const key = `helpFaqs:${category}`;
    const faqs = await redis.lrange(key, 0, -1);

    let updated = false;
    const updatedFaqs = faqs.map((faqStr) => {
      const faq = JSON.parse(faqStr);
      if (faq.id === id) {
        updated = true;
        return JSON.stringify({ ...faq, heading, description });
      }
      return faqStr;
    });
    if (!updated) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }

    // Overwrite the entire list
    await redis.del(key);
    await redis.rpush(key, ...updatedFaqs);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteHelpFaq(req: Request, res: Response): Promise<void> {
  try {
    const { category, id } = req.body;

    if (!category || !id) {
      res.status(400).json({ error: "Category and id are required" });
      return;
    }

    const key = `helpFaqs:${category}`;
    const faqs = await redis.lrange(key, 0, -1);

    const filteredFaqs = faqs.filter((faqStr) => {
      const faq = JSON.parse(faqStr);
      return faq.id !== id;
    });

    if (filteredFaqs.length === faqs.length) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }

    await redis.del(key);
    if (filteredFaqs.length > 0) {
      await redis.rpush(key, ...filteredFaqs);
    }

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
