export default function Field({ label, name, id = name, error, as: Control = 'input', ...controlProps }) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <Control
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 w-full rounded-sm border bg-white px-3 py-2.5 ${
          error ? 'border-red-700' : 'border-mist-200'
        }`}
        {...controlProps}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
