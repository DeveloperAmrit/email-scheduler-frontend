import React from "react";

const EmailTemplateEditor = ({template,setTemplate,variables,setVariables}) => {

  // Function to parse the template
  const parseTemplate = (templateText) => {

    let parsed = templateText.replace(
      /{{(.*?)}}/g,
      `<span class="text-blue-600 font-bold">{{$1}}</span>`
    );

    parsed = parsed.replace(
      /\+\+(.*?)\+\+/g,
      `<span class="font-bold">$1</span>`
    );

    parsed = parsed.replace(
      /--(.*?)--/g,
      `<span class="italic">$1</span>`
    );

    parsed = parsed.replace(/\n/g, "<br>");

    return parsed;
  };

  const handleChange = (e) => {
    setTemplate(e.target.value);
    const variableMatches = [...template.matchAll(/{{(.*?)}}/g)];
    const variableNames = variableMatches.map((match) => match[1].toLocaleLowerCase());
    setVariables(variableNames);
    console.log(variables)
  };

  return (
    <div className="w-full min-h-96 p-4 mx-auto flex ">
      <div className="w-full min-h-96">
        <h1 className="w-full text-2xl font-bold mb-2">Email Template Editor</h1>
        <textarea
          className="w-full min-h-96 border border-gray-300 rounded p-2 h-40 focus:ring-2 focus:ring-blue-500"
          value={template}
          onChange={handleChange}
          placeholder="Write your email template here..."
        ></textarea>
      </div>
      <div className="w-full min-h-96">
        <h2 className="w-full text-xl font-semibold mb-2">Preview:</h2>
        <div
          className="w-full min-h-96 p-2 mt-3 border border-gray-300 rounded  bg-gray-50"
          dangerouslySetInnerHTML={{ __html: parseTemplate(template) }}
        ></div>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;
