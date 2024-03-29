import axios from 'axios';
import cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import juice from 'juice';
import { v4 as uuidv4 } from 'uuid';
import { Savedoc } from '../models/Htmldocs.js';
import { Readability } from '@mozilla/readability';
export const downloadContent = async (request, reply) => {
    const { url } = request.body;

    try {
        const existingHtmlDoc = await Savedoc.findOne({ url });
        if (existingHtmlDoc) {
          console.log('using existing page');
          reply.header('Content-Type', 'text/html').send(existingHtmlDoc.htmldoc);
        } else {
          // Fetch the HTML content of the URL
    const response = await axios.get(url);

    // Parse HTML content using JSDOM
    const { document } = new JSDOM(response.data).window;

    // Apply readability.js to extract main content
    const reader = new Readability(document);
    const article = reader.parse();


    // Send the modified HTML content as the response
    reply.header('Content-Type', 'text/html').send(article.content);
        }
  
        
    } catch (error) {
        console.error(`This page cannot be renarrated at the moment: ${error.message}`);
        reply.status(500).send(error);
    }
};

