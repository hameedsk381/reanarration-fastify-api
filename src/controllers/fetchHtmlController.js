import axios from 'axios';
import cheerio from 'cheerio';
import juice from 'juice';
import { v4 as uuidv4 } from 'uuid';
import { Savedoc } from '../models/Htmldocs.js';

export const downloadContent = async (request, reply) => {
    const { url } = request.body;

    try {
        const existingHtmlDoc = await Savedoc.findOne({ url });
        if (existingHtmlDoc) {
            console.log('using existing page')
            reply.header('Content-Type', 'text/html').send(existingHtmlDoc.htmldoc);
        } else {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            $('link[rel="icon"], link[rel="shortcut icon"]').remove();
            $('svg').attr({ 'width': '50', 'height': '50' });
            $('*').each((index, element) => {
                const el = $(element);
                el.removeAttr('onmouseover').removeAttr('onmouseout');
                if (el.css('position') === 'fixed' || el.css('position') === 'sticky') {
                    el.css('position', 'static');
                }
                const existingDataId = el.attr('data-id');
                el.attr('data-id', existingDataId || uuidv4());
            });

           

            $('header, footer, sidebar').remove(); // Remove header, footer, and sidebar tags

            const htmlContent = juice($.html());
           
            const newHtmlDoc = new Savedoc({
                htmldoc: htmlContent,
                url: url
            });
            await newHtmlDoc.save();
            console.log('using fetched page')
            reply.header('Content-Type', 'text/html').send(htmlContent);
        }
        
        
    } catch (error) {
        console.error(`This page cannot be renarrated at the moment: ${error.message}`);
        reply.status(500).send('This page cannot be renarrated at the moment');
    }
};

