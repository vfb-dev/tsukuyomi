import { MovieInput } from "@/lib/api";

type MovieFormFieldsProps = {
  defaultValues?: Partial<MovieInput>;
};

export function MovieFormFields({ defaultValues }: MovieFormFieldsProps) {
  return (
    <>
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues?.title}
          className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          defaultValue={defaultValues?.description}
          className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <label
            htmlFor="releaseYear"
            className="text-sm font-medium text-gray-300"
          >
            Release Year
          </label>
          <input
            id="releaseYear"
            name="releaseYear"
            type="number"
            min={1888}
            required
            defaultValue={defaultValues?.releaseYear}
            className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          />
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="durationMinutes"
            className="text-sm font-medium text-gray-300"
          >
            Duration Minutes
          </label>
          <input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min={1}
            required
            defaultValue={defaultValues?.durationMinutes}
            className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          />
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            required
            defaultValue={defaultValues?.category}
            className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="posterUrl"
          className="text-sm font-medium text-gray-300"
        >
          Poster URL
        </label>
        <input
          id="posterUrl"
          name="posterUrl"
          type="text"
          required
          defaultValue={defaultValues?.posterUrl}
          className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Local posters can use /media/posters/example.jpg
        </p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="videoUrl" className="text-sm font-medium text-gray-300">
          Video URL
        </label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="text"
          required
          defaultValue={defaultValues?.videoUrl}
          className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Local videos can use /media/videos/example.mp4
        </p>
      </div>
    </>
  );
}
