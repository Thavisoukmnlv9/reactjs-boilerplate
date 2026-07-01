import { X } from 'lucide-react'
import { type KeyboardEvent, type ReactNode, useRef, useState } from 'react'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'

export const SUGGESTIONS_DEFAULT = [
  'family',
  'romantic',
  'local',
  'budget',
  'luxury',
  'nature',
  'nightlife',
  'vegan-friendly',
  'wifi',
  'kid-friendly',
  'halal',
  'kosher',
  'vegetarian',
  'gluten-free',
  'organic',
]

export const SUGGESTIONS_RESTAURANT = [
  'local',
  'international',
  'family-friendly',
  'romantic',
  'business-friendly',
  'budget',
  'midrange',
  'luxury',
  'street-food',
  'fine-dining',
  'casual-dining',
  'buffet',
  'vegetarian',
  'vegan',
  'halal',
  'kosher',
  'gluten-free',
  'seafood',
  'bbq',
  'noodles',
  'hotpot',
  'steakhouse',
  'breakfast',
  'brunch',
  'lunch',
  'dinner',
  'dessert',
  'private-dining',
  'outdoor-dining',
  'indoor-dining',
  'wifi',
  'kid-friendly',
  'parking',
  'reservation',
  'walk-in',
  'takeaway',
  'delivery',
]

export const SUGGESTIONS_BAR = [
  'cocktails',
  'craft-beer',
  'wine',
  'live-music',
  'rooftop',
  'happy-hour',
  'sports-bar',
  'lounge',
  'nightlife',
  'dance',
  'local',
  'international',
  'romantic',
  'group-friendly',
  'wifi',
  'parking',
  'reservation',
  'walk-in',
  'outdoor-seating',
]

export const SUGGESTIONS_SIGNATURE_DISHES = [
  'pad-thai',
  'tom-yum',
  'green-curry',
  'massaman',
  'som-tam',
  'pho',
  'fried-rice',
  'spring-rolls',
  'noodle-soup',
  'sticky-rice',
  'mango-sticky-rice',
  'papaya-salad',
  'laap',
  'khao-soi',
  'grilled-fish',
  'bbq-pork',
  'dim-sum',
  'sushi',
  'ramen',
]

interface TagsInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  label?: string
  placeholder?: string
  maxTags?: number
  maxLength?: number
  hint?: string
  error?: string
  disabled?: boolean
  icon?: ReactNode
}

const TagsInput = ({
  tags,
  onChange,
  suggestions = [],
  label = 'Tags',
  placeholder = 'Type and press Enter…',
  maxTags = 20,
  maxLength = 24,
  hint = 'Max 20 tags, each up to 24 characters.',
  error,
  disabled,
  icon,
}: TagsInputProps) => {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase()
    if (
      !trimmed ||
      trimmed.length > maxLength ||
      tags.length >= maxTags ||
      tags.includes(trimmed)
    )
      return
    onChange([...tags, trimmed])
    setInput('')
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const filtered = suggestions.filter(
    (s) =>
      !tags.includes(s) &&
      (input.length === 0 || s.toLowerCase().includes(input.toLowerCase()))
  )

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {tags.length}/{maxTags}
        </span>
      </div>

      <div
        className={`relative flex flex-wrap items-center gap-1.5 p-2 rounded-lg border bg-card min-h-[42px] cursor-text ${
          error ? 'border-destructive' : 'border-input'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''} ${icon ? 'pl-9' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
        ) : null}
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 pl-2.5 pr-1 py-0.5 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(tag)
              }}
              className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || tags.length >= maxTags}
          className="border-0 shadow-none focus-visible:ring-0 h-7 min-w-[120px] flex-1 px-1 text-sm"
        />
      </div>

      {showSuggestions && filtered.length > 0 && input.length === 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addTag(s)}
              className="text-xs px-2.5 py-1 rounded-full border border-input bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}

      {showSuggestions && input.length > 0 && filtered.length > 0 && (
        <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
          {filtered.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addTag(s)}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export default TagsInput
