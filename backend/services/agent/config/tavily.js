//This code configures and exports a pre-built web search tool using Tavily via the LangChain integration package
//Tavily is a search engine built specifically for autonomous AI agents and LLMs—instead of returning raw HTML and ads, it parses web content directly into clean text snippets, URLs, and image links.

import { TavilySearch } from "@langchain/tavily";

export const searchTool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  includeImages:true
});