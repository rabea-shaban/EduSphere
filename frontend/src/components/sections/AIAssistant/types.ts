export interface AICapability {
  id: string;
  title: string;
  iconName: "cap" | "help" | "lightbulb" | "zap";
}

export interface AIAssistantProps {
  title1?: string;
  title2Highlight?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  promptQuestion?: string;
  capabilities?: AICapability[];
  className?: string;
}
