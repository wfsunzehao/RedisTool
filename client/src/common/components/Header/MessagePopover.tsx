import React from "react";
import { Popover, List, ListItem, Divider, Box } from "@mui/material";

interface Message {
  text: string;
  timestamp: number; // 将类型调整为 number
}

interface MessagePopoverProps {
  anchorEl: HTMLElement | null;
  messages: Message[]; // 修改类型定义
  handleClose: () => void;
}

export default function MessagePopover({ anchorEl, messages, handleClose }: MessagePopoverProps) {
  const open = Boolean(anchorEl);

  return (
    <Popover
      id="message-popover"
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {messages.length > 0 ? (
        <List>
          {messages.map(({ text, timestamp }, index) => (
            <div key={index}>
              <ListItem>
                <Box>
                  Submission {index + 1}: {text}
                  <br />
                  <small>{new Date(timestamp).toLocaleString()}</small> {/* 将 number 转换为可读时间 */}
                </Box>
              </ListItem>
              {index < messages.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      ) : (
        <Box sx={{ padding: 2 }}>No messages</Box>
      )}
    </Popover>
  );
}
