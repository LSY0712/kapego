import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function PasswordResetModal({ show, onClose, userEmail = '' }) {
  const [step, setStep] = useState(1); // 1 = 發送驗證碼, 2 = 輸入新密碼
  const [email, setEmail] = useState(userEmail);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      toast.error('請輸入 Email！');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: 發送驗證碼 API
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬

      toast.success('驗證碼已寄出！');
      setStep(2);
    } catch (err) {
      toast.error('發送驗證碼失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPassword = async () => {
    if (!verificationCode || !newPassword || !confirmPassword) {
      toast.error('請填寫所有欄位！');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('兩次密碼不一致！');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: 修改密碼 API
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬

      toast.success('密碼已成功修改！');
      handleClose();
    } catch (err) {
      toast.error('密碼修改失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail(userEmail);
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{step === 1 ? '發送驗證碼' : '修改密碼'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>電子郵件</Form.Label>
              <Form.Control
                type="email"
                placeholder="請輸入您的 Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-100"
            >
              {isLoading ? '發送中...' : '發送驗證碼'}
            </Button>
          </Form>
        )}

        {step === 2 && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>驗證碼</Form.Label>
              <Form.Control
                type="text"
                placeholder="請輸入收到的驗證碼"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>新密碼</Form.Label>
              <Form.Control
                type="password"
                placeholder="請輸入新密碼"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>確認新密碼</Form.Label>
              <Form.Control
                type="password"
                placeholder="再次輸入新密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleSubmitPassword}
              disabled={isLoading}
              className="w-100"
            >
              {isLoading ? '提交中...' : '提交修改'}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
