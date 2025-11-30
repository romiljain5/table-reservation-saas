// src/components/motion/MotionDiv.tsx
"use client";

import { motion, MotionProps } from "framer-motion";
import { HTMLAttributes } from "react";

type Props = MotionProps & HTMLAttributes<HTMLDivElement>;

export const MotionDiv = (props: Props) => <motion.div {...props} />;
