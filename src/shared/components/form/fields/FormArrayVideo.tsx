import { AlertCircle, Play, Upload, X } from 'lucide-react'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import { Field } from './Field'

export type FormArrayVideoProps = {
  name: string // server URLs only
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  className?: string
  fileFieldName?: string // Files only
  maxFiles?: number
  maxSizeBytes?: number
  acceptedTypes?: string[]
  disabled?: boolean
  onFileSelect?: (files: File[]) => void
}

export function FormArrayVideo({
  name,
  label,
  hint,
  requiredMark,
  className,
  fileFieldName,
  maxFiles = 5,
  maxSizeBytes = 1024 * 1024 * 1024,
  acceptedTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/x-msvideo', // avi
    'video/quicktime', // mov
    'video/x-ms-wmv', // wmv
    'video/x-flv', // flv
    'video/x-matroska', // mkv
    'video/mkv',
  ],
  disabled = false,
  onFileSelect,
}: FormArrayVideoProps) {
  const { control, setValue, watch } = useFormContext()
  const fileKey = fileFieldName ?? `${name}Files`

  // server URLs (strings) from form
  const serverUrls = (watch(name) as string[]) || []
  // Files from form
  const files = (watch(fileKey as any) as File[]) || []

  // local blob urls derived directly from `files` to avoid state loops
  const blobUrls = useMemo(() => {
    return files.map((f) => URL.createObjectURL(f))
  }, [files])
  const [alertMessage, setAlertMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [loading, setLoading] = useState<Set<string>>(new Set())

  // Cleanup blob URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      blobUrls.forEach((u) => {
        if (u?.startsWith('blob:')) URL.revokeObjectURL(u)
      })
    }
  }, [blobUrls])

  // Combined preview (derived only)
  const previewUrls = useMemo(() => {
    return [...serverUrls, ...blobUrls]
  }, [serverUrls, blobUrls])

  // Auto-hide alert
  useEffect(() => {
    if (!showAlert) return
    const t = setTimeout(() => setShowAlert(false), 4000)
    return () => clearTimeout(t)
  }, [showAlert])

  // Keep loading set clean
  useEffect(() => {
    setLoading((prev) => {
      const next = new Set<string>()
      previewUrls.forEach((u) => {
        if (prev.has(u)) next.add(u)
      })

      // If no change in contents, return prev to avoid unnecessary updates
      if (next.size === prev.size) {
        let changed = false
        for (const v of prev) {
          if (!next.has(v)) {
            changed = true
            break
          }
        }
        if (!changed) return prev
      }
      return next
    })
  }, [previewUrls])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])

    const typeOk = selected.filter((file) => {
      if (!file.type)
        return /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i.test(file.name)
      return acceptedTypes.includes(file.type)
    })
    if (typeOk.length !== selected.length) {
      setAlertMessage('Some files have invalid types.')
      setShowAlert(true)
    }

    const sizeOk = typeOk.filter((f) => f.size <= maxSizeBytes)
    if (sizeOk.length !== typeOk.length) {
      setAlertMessage('Some files are too large. Max 1GB each.')
      setShowAlert(true)
    }

    // enforce limit across server + existing files + new
    const remaining = Math.max(0, maxFiles - (serverUrls.length + files.length))
    const toAdd = sizeOk.slice(0, remaining)
    const newFiles = [...files, ...toAdd]

    setValue(fileKey as any, newFiles, {
      shouldDirty: true,
      shouldTouch: true,
    })
    onFileSelect?.(newFiles)

    // allow re-selecting same file name after removal
    e.currentTarget.value = ''
  }

  const handleRemoveVideo = (index: number) => {
    const serverCount = serverUrls.length

    if (index < serverCount) {
      // remove server URL at index
      const nextServer = serverUrls.filter((_, i) => i !== index)
      setValue(name, nextServer, { shouldDirty: true, shouldTouch: true })
      // loading spinner cleanup
      setLoading((prev) => {
        const next = new Set(prev)
        next.delete(previewUrls[index])
        return next
      })
      return
    }

    // remove blob/file at (index - serverCount)
    const blobIdx = index - serverCount
    const url = blobUrls[blobIdx]

    if (url?.startsWith('blob:')) URL.revokeObjectURL(url)

    const nextFiles = files.filter((_, i) => i !== blobIdx)
    setValue(fileKey as any, nextFiles, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setLoading((prev) => {
      const next = new Set(prev)
      next.delete(url)
      return next
    })
  }

  return (
    <Field
      name={name}
      label={label}
      hint={hint}
      requiredMark={requiredMark}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={() => (
          <div className="space-y-4">
            {showAlert && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex items-center">
                  <span>{alertMessage}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAlert(false)}
                    className="ml-2 h-auto p-0 text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {previewUrls.map((url, i) => (
                  <div key={url} className="group relative">
                    <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                      {url ? (
                        <>
                          <video
                            src={url}
                            className="h-full w-full object-cover"
                            controls
                            preload="metadata"
                            onLoadStart={() => {
                              setLoading((prev) => new Set(prev).add(url))
                            }}
                            onLoadedData={() => {
                              setLoading((prev) => {
                                const n = new Set(prev)
                                n.delete(url)
                                return n
                              })
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              setLoading((prev) => {
                                const n = new Set(prev)
                                n.delete(url)
                                return n
                              })
                            }}
                          />
                          {loading.has(url) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                              <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Play className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveVideo(i)}
                      disabled={disabled}
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {previewUrls.length < maxFiles ? (
              <div className="flex w-full items-center justify-center">
                <label
                  htmlFor={`${name}-upload`}
                  className={cn(
                    'flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed bg-muted/10 transition-colors hover:bg-muted/20',
                    disabled && 'cursor-not-allowed opacity-50'
                  )}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                    <p className="mb-2 text-muted-foreground text-sm">
                      <span className="font-semibold">Click to upload</span>{' '}
                      videos
                    </p>
                    <p className="text-muted-foreground text-xs">
                      MP4, WebM, OGG, AVI, MOV, WMV, FLV, MKV (MAX. 1GB each)
                    </p>
                  </div>
                  <input
                    id={`${name}-upload`}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileSelect}
                    disabled={disabled}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm">
                Maximum {maxFiles} videos allowed
              </p>
            )}
          </div>
        )}
      />
    </Field>
  )
}
