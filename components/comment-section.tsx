"use client"

interface CommentSectionProps {
  comment: string
  onCommentChange: (comment: string) => void
}

export function CommentSection({ comment, onCommentChange }: CommentSectionProps) {
  // Return null to not render anything
  return null
}
