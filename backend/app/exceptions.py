

class SavantAPiException(Exception):
    def __init__(self, status_code:int, error_details:str):
        self.status_code = status_code
        self.error_details = error_details


# Item Not Found 
class NotFoundException(SavantAPiException):
    def __init__(self, resource_type: str, target_resource:int):
        super().__init__(
            status_code=404,
            error_details = f"{resource_type} with ID {target_resource} was not found"
        )


#duplicate item already exists
class ConflictException(SavantAPiException):
    def __init__(self, resource_type: str, target_resource:int):
        super().__init__(
            status_code=409,
            error_details = f"{resource_type} with ID {target_resource} already exists"
        )


# Forbidden
class NotAuthorizedException(SavantAPiException):
    def __init__(self, resource_type: str, target_resource:int, patient_id:int):
        super().__init__(
            status_code=403,
            error_details = f"Forbidden, Patient {patient_id} doesn't own {resource_type} {target_resource} "
        )


