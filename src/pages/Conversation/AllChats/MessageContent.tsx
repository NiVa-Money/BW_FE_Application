import { useMessageStatus } from "../../../hooks/useMessageStatus";

const MessageComponent = ({ msg, isUserQuery, content, msgType }) => {
  const getContent = () => {
    if (
      msg?.messageType === "flow_response" &&
      msg?.messageContent?.flowResponse
    ) {
      const { responseJson } = msg.messageContent.flowResponse;
      try {
        const parsed = JSON.parse(responseJson);
        return Object.entries(parsed)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
      } catch {
        return responseJson;
      }
    }

    if (typeof content === "string") return content;
    if (content?.text) return content.text;
    if (content?.template?.body?.text) {
      const bodyText = content.template.body.text;
      return Array.isArray(bodyText) ? bodyText.join(" ") : bodyText;
    }
    return "";
  };

  const status = useMessageStatus({
    status: msg?.status,
    readTime: msg?.readTime,
    sentTime: msg?.sentTime,
    deliveredTime: msg?.deliveredTime,
    createdAt: msg?.createdAt,
  });

  const commonClasses =
    "px-4 py-3 rounded-lg max-w-[80%] break-words shadow-sm";
  const getClasses = (base) => `${commonClasses} ${base}`;

  const renderTextWithParams = (text, parameters) => {
    if (!text) return "";
    if (!parameters) return text;

    let renderedText = text;

    if (parameters.type === "positional" && parameters.example?.positional) {
      renderedText = text.replace(
        /{{(\d+)}}/g,
        (_, i) => parameters.example.positional[parseInt(i) - 1] || `{{${i}}}`
      );
    } else if (parameters.type === "named" && parameters.example?.named) {
      renderedText = text.replace(/{{(\w+)}}/g, (_, name) => {
        const param = parameters.example.named.find((p) => p[name]);
        return param?.[name] || `{{${name}}}`;
      });
    }

    return renderedText.replace(/\n\s*\n/g, "\n").trim();
  };

  const renderStatus = (status) => {
    if (!status) return null;

    const isFailed = msg?.status === "failed";
    return (
      <div
        className={`text-xs mt-1 ${
          isFailed ? "text-red-500 font-semibold" : "text-gray-400"
        } ${isUserQuery ? "text-left" : "text-right"}`}
      >
        {isFailed ? "Failed to send" : status}
      </div>
    );
  };

  let messageContent;

  switch (msgType) {
    case "text": {
      const textClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";

      messageContent = (
        <div className={getClasses(textClasses)}>
          <p className="whitespace-pre-wrap">
            {msg?.messageContent?.body || getContent()}
          </p>
          {renderStatus(status)}
        </div>
      );
      break;
    }

    case "template": {
      const templateClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-white text-black border border-gray-200";

      const template = msg.messageContent?.template || {};
      const header = template.header || {};
      const bodyText = renderTextWithParams(
        Array.isArray(template.body?.text)
          ? template.body.text.join(" ")
          : template.body?.text || "",
        template.body?.parameters
      );

      const headerImage =
        header.type === "IMAGE"
          ? header.IMAGE || header.content || header.image
          : null;
      const headerText =
        header.type === "TEXT"
          ? renderTextWithParams(
              header.content || header.text,
              header.parameters
            )
          : null;

      const buttons = template.buttons || [];

      messageContent = (
        <div className={getClasses(templateClasses)}>
          {headerText && (
            <strong className="block mb-2 text-lg">{headerText}</strong>
          )}
          {headerImage && (
            <img
              src={headerImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (header.s3Url && target.src !== header.s3Url) {
                  target.src = header.s3Url;
                }
              }}
              className="self-center w-full max-w-[300px] rounded-md mb-2"
              width={200}
              height={200}
              alt="Template Header"
            />
          )}
          {header.type === "VIDEO" && header.content && (
            <video controls className="w-full max-w-[300px] rounded-md mb-2">
              <source src={header.content} type="video/mp4" />
            </video>
          )}
          {header.type === "DOCUMENT" && header.content && (
            <a
              href={header.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mb-2 block"
            >
              View Document
            </a>
          )}
          {bodyText && <p className="whitespace-pre-wrap mb-2">{bodyText}</p>}
          {renderStatus(status)}
          {template.footer?.text && (
            <span className="mt-2 text-sm italic text-gray-500">
              {template.footer.text}
            </span>
          )}
          {Array.isArray(buttons) && buttons.length > 0 && (
            <div className="mt-2 space-y-2">
              {buttons.map((btn, i) => (
                <button
                  key={i}
                  className="w-full h-10 text-base text-center bg-transparent font-medium text-[#005C4B] border border-[#005C4B] rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    if (btn.type === "URL" && btn.url) {
                      window.open(btn.url, "_blank");
                    } else if (btn.type === "PHONE_NUMBER" && btn.phoneNumber) {
                      window.location.href = `tel:${btn.phoneNumber}`;
                    }
                  }}
                >
                  {btn.text}
                </button>
              ))}
            </div>
          )}
        </div>
      );
      break;
    }

    case "button_reply": {
      const classesBasedOnOrigin = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";

      messageContent = (
        <div
          className={`${commonClasses} ${classesBasedOnOrigin} min-w-[240px]`}
        >
          <p className="whitespace-pre-wrap">
            {msg?.messageContent?.text || "No text provided."}
          </p>
          {renderStatus(status)}
        </div>
      );
      break;
    }

    case "flow_response": {
      const flowResponseClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";

      const parseFlowResponse = () => {
        try {
          const parsed = JSON.parse(
            msg.messageContent.flowResponse.responseJson
          );
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-white/20">
                <span className="font-bold">Form Response</span>
              </div>
              {Object.entries(parsed).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 text-base">
                  <span className="col-span-1 w-[200px] opacity-80 capitalize">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span className="col-span-2 font-medium">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          );
        } catch {
          return msg?.messageContent?.flowResponse?.responseJson;
        }
      };

      messageContent = (
        <div
          className={`${commonClasses} ${flowResponseClasses} min-w-[240px]`}
        >
          {parseFlowResponse()}
          {renderStatus(status)}
        </div>
      );
      break;
    }

    case "image": {
      const classes = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";
      const image = msg?.messageContent?.image || {};
      messageContent = (
        <div className={getClasses(classes)}>
          <img
            src={image.url}
            alt="Shared"
            className="w-full max-w-[300px] rounded-md"
          />
          {(image.caption || image.text) && (
            <p className="mt-2 text-sm whitespace-pre-wrap">
              {image.caption || image.text}
            </p>
          )}
          {renderStatus(status)}
        </div>
      );
      break;
    }

    case "audio": {
      const classes = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-white text-black";
      const audio = msg?.messageContent?.audio || {};
      messageContent = (
        <div className={getClasses(classes)}>
          <audio controls className="w-full">
            <source src={audio.url} type="audio/ogg" />
            Your browser does not support the audio element.
          </audio>
          {audio.text && (
            <p className="mt-2 text-sm whitespace-pre-wrap">{audio.text}</p>
          )}
          {renderStatus(status)}
        </div>
      );
      break;
    }

    case "video": {
      const classes = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-white text-black";
      const video = msg?.messageContent?.video || {};
      messageContent = (
        <div className={getClasses(classes)}>
          <video controls className="w-full max-w-[300px] rounded-md">
            <source src={video.url || getContent()} type="video/mp4" />
            Your browser does not support the video element.
          </video>
          {video.caption && (
            <p className="mt-2 text-sm whitespace-pre-wrap">{video.caption}</p>
          )}
          {renderStatus(status)}
        </div>
      );
      break;
    }

    case "interactive": {
      const interactiveClasses = isUserQuery
        ? "bg-[#d8ede6] max-w-[300px] text-black"
        : "bg-white text-black border border-gray-200 max-w-[300px]";

      const interactive = content || {};
      const type = interactive.type || "";
      const bodyText = interactive.body?.text || "";
      const headerText = interactive.header?.text || "";
      const footerText = interactive.footer?.text || "";

      if (type === "list") {
        const sections = interactive.action?.sections || [];
        const listButtonText = interactive.action?.button || "Select";

        messageContent = (
          <div className={getClasses(interactiveClasses)}>
            {headerText && (
              <strong className="block mb-2 text-lg font-semibold text-gray-800">
                {headerText}
              </strong>
            )}
            {bodyText && (
              <p className="whitespace-pre-wrap mb-3 text-gray-700">
                {bodyText}
              </p>
            )}
            {sections.map((section, index) => (
              <div key={index} className="mb-3">
                {section.title && (
                  <h4 className="font-medium text-gray-700 mb-2">
                    {section.title}
                  </h4>
                )}
                {section.rows && section.rows.length > 0 && (
                  <div className="space-y-2">
                    {section.rows.map((row, i) => (
                      <div
                        key={i}
                        className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <p className="font-medium text-gray-800">{row.title}</p>
                        {row.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {row.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button
              className="w-full h-10 text-base text-center bg-gray-100 font-medium text-[#005C4B] border border-[#005C4B] rounded-md opacity-50 cursor-not-allowed"
              disabled
            >
              {listButtonText}
            </button>
            {footerText && (
              <span className="mt-3 block text-sm italic text-gray-500">
                {footerText}
              </span>
            )}
            {renderStatus(status)}
          </div>
        );
      } else if (type === "location_request_message") {
        const actionName = interactive.action?.name || "Send Location";

        messageContent = (
          <div className={getClasses(interactiveClasses)}>
            {bodyText && (
              <p className="whitespace-pre-wrap mb-3 text-gray-700">
                {bodyText}
              </p>
            )}
            <button
              className="w-full h-10 text-base text-center bg-gray-100 font-medium text-[#005C4B] border border-[#005C4B] rounded-md opacity-50 cursor-not-allowed"
              disabled
            >
              {actionName}
            </button>
            {renderStatus(status)}
          </div>
        );
      } else {
        messageContent = (
          <div className={getClasses(interactiveClasses)}>
            <p className="whitespace-pre-wrap mb-2 text-gray-700">
              Interactive message
            </p>
            {renderStatus(status)}
          </div>
        );
      }
      break;
    }

    case "list_reply": {
      const listReplyClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";

      messageContent = (
        <div className={`${commonClasses} ${listReplyClasses} min-w-[250px]`}>
          <p className="whitespace-pre-wrap">
            {msg?.messageContent?.text || "No selection provided."}
          </p>
          {renderStatus(status)}
        </div>
      );
      break;
    }

    default: {
      const classes = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";
      messageContent = (
        <div className={getClasses(classes)}>
          <p className="whitespace-pre-wrap">{getContent()}</p>
          {renderStatus(status)}
        </div>
      );
    }
  }

  return messageContent;
};

export default MessageComponent;
