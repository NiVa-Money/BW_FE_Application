import { useMessageStatus } from "../../../hooks/useMessageStatus";

const MessageComponent = ({ msg, isUserQuery, content, msgType }) => {
  const getContent = () => {
    if (typeof content === "string") return content;
    if (content?.text) return content.text;
    if (content?.template?.body?.text) {
      // Handle both string and array cases for body text
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
    "px-3 py-2 rounded-lg max-w-[75%] break-words overflow-wrap"; // Removed flex-related classes
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

    // Preserve newlines and replace multiple spaces
    return renderedText
      .replace(/\n\s*\n/g, "\n") // Normalize multiple newlines
      .trim();
  };

  let messageContent;

  switch (msgType) {
    case "text": {
      const textClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";

      messageContent = (
        <div className={getClasses(textClasses)}>
          <p className="whitespace-pre-wrap">{getContent()}</p>
          {status}
        </div>
      );
      break;
    }

    case "template": {
      const templateClasses = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-white text-black border border-gray-200";

      const template = msg.messageContent?.template || {};
      const header = template.header || template.Header || {};

      // Handle header (text or image)
      const headerImage =
        header.type === "IMAGE"
          ? header.content || header.s3Url || header.image
          : header.image || null;
      const headerText =
        header.type === "TEXT"
          ? renderTextWithParams(
              header.content || header.text,
              header.parameters
            )
          : header.text || null;

      const buttons = template.buttons || [];
      const bodyText = renderTextWithParams(
        Array.isArray(template.body?.text)
          ? template.body.text.join(" ")
          : template.body?.text || "",
        template.body?.parameters
      );

      messageContent = (
        <div className={getClasses(templateClasses)}>
          {/* Header rendering */}
          {headerText && (
            <strong className="block mb-2 text-lg">{headerText}</strong>
          )}
          {headerImage && (
            <img
              src={headerImage}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
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

          {/* Body Text */}
          {bodyText && <p className="whitespace-pre-wrap mb-2">{bodyText}</p>}
          {status}

          {/* Footer */}
          {template.footer?.text && (
            <span className="mt-2 text-sm italic text-gray-500">
              {template.footer.text}
            </span>
          )}

          {/* Buttons - Only render if buttons exist */}
          {(Array.isArray(buttons) && buttons.length > 0) ||
          (buttons && typeof buttons === "object") ? (
            <div className="mt-2">
              {Array.isArray(buttons) ? (
                buttons.map((btn, i) => (
                  <button
                    key={i}
                    className="w-full h-10 text-base text-center mb-2 bg-transparent font-medium text-[#005C4B] border border-[#005C4B] rounded-md hover:bg-gray-100"
                    onClick={() => {
                      if (btn.type === "URL" && btn.url) {
                        window.open(btn.url, "_blank");
                      } else if (
                        btn.type === "PHONE_NUMBER" &&
                        btn.phoneNumber
                      ) {
                        window.location.href = `tel:${btn.phoneNumber}`;
                      }
                    }}
                  >
                    {btn.text}
                  </button>
                ))
              ) : (
                <button
                  className="w-full h-10 text-base text-center mb-2 bg-transparent font-medium text-[#005C4B] border border-[#005C4B] rounded-md hover:bg-gray-100"
                  onClick={() => {
                    if (buttons.type === "URL" && buttons.url) {
                      window.open(buttons.url, "_blank");
                    } else if (
                      buttons.type === "PHONE_NUMBER" &&
                      buttons.phoneNumber
                    ) {
                      window.location.href = `tel:${buttons.phoneNumber}`;
                    }
                  }}
                >
                  {buttons.text}
                </button>
              )}
            </div>
          ) : null}
        </div>
      );
      break;
    }

    case "button_reply":
    case "flow_response": {
      const classes = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-[#005C4B] text-white";
      messageContent = (
        <div className={getClasses(classes)}>
          <p className="whitespace-pre-wrap">{getContent()}</p>
          {status}
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
          <img src={image.url} alt="Shared" className="w-full rounded-md" />
          {image.caption && (
            <p className="mt-2 text-sm whitespace-pre-wrap">{image.caption}</p>
          )}
          {status}
        </div>
      );
      break;
    }

    case "audio": {
      const classes = isUserQuery
        ? "bg-[#d8ede6] text-black"
        : "bg-white text-black";
      messageContent = (
        <div className={getClasses(classes)}>
          <audio controls>
            <source src={getContent()} type="audio/ogg" />
          </audio>
          {status}
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
          <video controls className="w-full rounded-md">
            <source src={video.url || getContent()} type="video/mp4" />
          </video>
          {video.caption && (
            <p className="mt-2 text-sm whitespace-pre-wrap">{video.caption}</p>
          )}
          {status}
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
          {status}
        </div>
      );
    }
  }

  return (
    <div
      className={`flex ${isUserQuery ? "justify-start" : "justify-end"} mb-2`}
    >
      {messageContent}
    </div>
  );
};

export default MessageComponent;
