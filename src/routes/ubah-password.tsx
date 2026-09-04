import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/ubah-password")({
  head: () => ({ meta: [{ title: "Ubah Password" }] }),
  component: UbahPassword,
});

const PRIMARY = "#2953A4";

const RULES = [
  { id: "upper", label: "Huruf kapital", test: (v: string) => /[A-Z]/.test(v) },
  { id: "lower", label: "Huruf kecil", test: (v: string) => /[a-z]/.test(v) },
  { id: "digit", label: "Angka", test: (v: string) => /[0-9]/.test(v) },
  { id: "symbol", label: "Spesial karakter", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

function UbahPassword() {
  const nav = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [currentErr, setCurrentErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [success, setSuccess] = useState(false);

  const longEnough = next.length >= 8;
  const rulesOk = RULES.every((r) => r.test(next));
  const newValid = longEnough && rulesOk;
  const match = confirm.length > 0 && confirm === next;
  const canSave = current.length > 0 && newValid && match;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let ok = true;
    if (current.length < 8) {
      setCurrentErr("Password salah, silakan cek dan coba lagi!");
      ok = false;
    } else {
      setCurrentErr("");
    }
    if (confirm !== next) {
      setConfirmErr("Password tidak sama, silakan cek kembali");
      ok = false;
    } else {
      setConfirmErr("");
    }
    if (ok && canSave) setSuccess(true);
  };

  const inputCls = (err: string) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 pr-11 text-[14px] text-slate-800 outline-none placeholder:text-slate-300 ${
      err ? "border-red-400" : "border-slate-200"
    }`;

  return (
    <MobileShell hideNav>
      <div className="bg-white px-5 pb-2 pt-12">
        <Link to="/profile" className="inline-flex items-center gap-2 text-slate-900">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-[17px] font-medium">Ubah Password</span>
        </Link>
      </div>

      <form onSubmit={submit} className="space-y-4 bg-white px-5 pb-8 pt-4">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">Ubah Password</h2>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Masukkan password saat ini dan buat password baru untuk memperbarui akun Anda.
          </p>
        </div>

        <div>
          <Label>Password Saat Ini</Label>
          <div className="relative">
            <input
              type={show.current ? "text" : "password"}
              value={current}
              onChange={(e) => {
                setCurrent(e.target.value);
                setCurrentErr("");
              }}
              placeholder="Masukkan Password Saat Ini"
              className={inputCls(currentErr)}
            />
            <EyeBtn open={show.current} onClick={() => setShow((s) => ({ ...s, current: !s.current }))} />
          </div>
          {currentErr && <Err>{currentErr}</Err>}
        </div>

        <div>
          <Label>Password Baru</Label>
          <div className="relative">
            <input
              type={show.next ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Masukkan Password Baru"
              className={inputCls("")}
            />
            <EyeBtn open={show.next} onClick={() => setShow((s) => ({ ...s, next: !s.next }))} />
          </div>
          <p className="mt-2 text-[12px] text-slate-500">
            Password harus berisi minimal 8 karakter dan kombinasi dari:
          </p>
          <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {RULES.map((r) => {
              const met = next.length > 0 && r.test(next);
              return (
                <p key={r.id} className={`flex items-center gap-1.5 text-[12px] ${met ? "text-green-600" : "text-slate-400"}`}>
                  {met ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
                  {r.label}
                </p>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Konfirmasi Password Baru</Label>
          <div className="relative">
            <input
              type={show.confirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setConfirmErr("");
              }}
              placeholder="Konfirmasi Password Baru"
              className={inputCls(confirmErr)}
            />
            <EyeBtn open={show.confirm} onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))} />
          </div>
          {confirmErr && <Err>{confirmErr}</Err>}
        </div>

        <button
          type="submit"
          disabled={!canSave}
          className="w-full rounded-lg py-3 text-[14px] font-semibold text-white disabled:bg-slate-100 disabled:text-slate-400"
          style={canSave ? { background: PRIMARY } : undefined}
        >
          Simpan
        </button>
      </form>

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-10">
          <div className="w-full max-w-[300px] rounded-2xl bg-white p-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400">
              <Check className="h-6 w-6 text-white" strokeWidth={3} />
            </span>
            <p className="mt-3 text-[15px] font-bold text-slate-900">Password Berhasil Diperbarui</p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
              Silakan login ulang dengan menggunakan password baru Anda.
            </p>
            <button
              onClick={() => nav({ to: "/login" })}
              className="mt-4 w-full rounded-lg py-2.5 text-[14px] font-semibold text-white"
              style={{ background: PRIMARY }}
            >
              Login Ulang
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-[12px] text-slate-600">{children}</label>;
}

function Err({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-[12px] text-red-500">{children}</p>;
}

function EyeBtn({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Sembunyikan" : "Tampilkan"}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
    >
      {open ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}
