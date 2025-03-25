import { useState, useEffect } from "react";
import { Input } from "./Input";
import { Button } from "../Common/PrimaryButton";
import { Loader } from "../Common/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterAdmin() {
  const [hostels, setHostels] = useState([]);
  const [hostel, setHostel] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/hostel/hostels");
        const data = await res.json();
        console.log(data);
          setHostels(data);

      } catch (err) {
        console.error("Error fetching hostels:", err);
      }
    };
    fetchHostels();
  }, []);

  const registerAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let admin = {
        name,
        email,
        father_name: fatherName,
        contact,
        address,
        dob,
        cnic,
        hostel,
        password
      };
      const res = await fetch("http://localhost:3000/api/admin/register-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(admin),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Admin ${data.admin.name} Registered Successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        setName("");
        setEmail("");
        setFatherName("");
        setContact("");
        setAddress("");
        setDob("");
        setCnic("");
        setPassword("");
        setHostel("");
        setLoading(false);
      } else {
        data.errors.forEach((err) => {
          toast.error(err.msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        });
        setLoading(false);
      }
    } catch (err) {
      toast.error("Registration failed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-h-screen pt-20 flex flex-col items-center justify-center">
      <h1 className="text-white font-bold text-5xl mt-10 mb-5">Register Admin</h1>
      <div className="md:w-[60vw] w-full p-10 bg-neutral-950 rounded-lg shadow-xl mb-10 overflow-auto">
        <form method="post" onSubmit={registerAdmin} className="flex flex-col gap-3">
          <div className="flex gap-5 flex-wrap justify-center md:w-full sw-[100vw]">
            <Input field={{ name: "name", placeholder: "Admin Name", type: "text", req: true, value: name, onChange: (e) => setName(e.target.value) }} />
            <Input field={{ name: "email", placeholder: "Admin Email", type: "email", req: true, value: email, onChange: (e) => setEmail(e.target.value) }} />
            <Input field={{ name: "dob", placeholder: "Date of Birth", type: "date", req: true, value: dob, onChange: (e) => setDob(e.target.value) }} />
            <Input field={{ name: "cnic", placeholder: "CNIC (without dashes)", type: "text", req: true, value: cnic, onChange: (e) => setCnic(e.target.value) }} />
          </div>
          <div className="flex gap-5 w-full flex-wrap justify-center">
            <Input field={{ name: "father_name", placeholder: "Father's Name", type: "text", req: true, value: fatherName, onChange: (e) => setFatherName(e.target.value) }} />
            <Input field={{ name: "contact", placeholder: "Contact Number", type: "text", req: true, value: contact, onChange: (e) => setContact(e.target.value) }} />
            <select className="flex gap-5 w-40 h-10 mt-7 flex-wrap justify-center p-2 border rounded bg-neutral-700 text-white" value={hostel} onChange={(e) => setHostel(e.target.value)} required>
              <option value="">Select a Hostel</option>
              {hostels.map((h) => (
                <option key={h.id} value={h.name}>{h.name}</option>
              ))}
            </select>
          </div>
          <div className="mx-12">
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-white">Address</label>
            <textarea name="address" placeholder="Full Address" required value={address} onChange={(e) => setAddress(e.target.value)} className="border flex-grow sm:text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div className="mx-12">
            <Input field={{ name: "password", placeholder: "Password", type: "password", req: true, value: password, onChange: (e) => setPassword(e.target.value) }} />
          </div>
          <div className="mt-5">
            <Button>{loading ? (<><Loader /> Registering...</>) : (<span>Register Admin</span>)}</Button>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="dark" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterAdmin;